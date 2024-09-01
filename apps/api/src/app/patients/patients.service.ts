import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { HospitalRoleName, PrismaClient, SuperRoleName } from '@prisma/client';
import * as generatePassword from 'generate-password';
import { NotificationsService } from '../notifications/notifications.service';
import { comparePasswords, encodePassword } from '../auth/bcrypt';
import * as ejs from 'ejs';
import * as fs from 'fs/promises';
import { ADMIN_URL } from '../core/consts/env.consts';
import { AddPatientDto } from './dto/add-patient.dto';
import { PatientDto } from './dto/patient.dto';
import { ListPatientPageDto } from './dto/list-patient-page.dto';
import { ListPatientDto } from './dto/list-patient.dto';
import { ViewPatientDto } from './dto/view-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private notificationService: NotificationsService) {}
  private prisma = new PrismaClient();

  generateRandomHexToken(length: number): string {
    const characters = '0123456789abcdef';
    let token = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters.charAt(randomIndex);
    }
    return token;
  }

  isValidMobileNumber(mobileNumber: string): boolean {
    // Define a regex pattern for a 10-digit mobile number
    const pattern = /^[0-9]{10}$/;

    // Test the provided mobile number against the pattern
    return pattern.test(mobileNumber);
  }

  async addPatient(
    hospitalId: number,
    doctorId: number,
    addPatientDto: AddPatientDto
  ): Promise<PatientDto> {
    if (Number.isNaN(hospitalId)) {
      throw new HttpException(
        'Hospital id is missing in params',
        HttpStatus.BAD_REQUEST
      );
    }

    if (Number.isNaN(doctorId)) {
      throw new HttpException(
        'Doctor id is missing in params',
        HttpStatus.BAD_REQUEST
      );
    }

    const token = this.generateRandomHexToken(16);
    const data = { ...addPatientDto, token };
    // Check if hospital exists
    const hospital = await this.prisma.hospital.findUnique({
      where: { id: hospitalId },
    });
    if (!hospital) {
      throw new HttpException(
        'Hospital not found, check hospitalId',
        HttpStatus.NOT_FOUND
      );
    }

    // Check if doctor exists
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new HttpException(
        'Doctor not found, check doctorId',
        HttpStatus.NOT_FOUND
      );
    }

    // Check if phone number is valid
    const isPhoneNumberValid = this.isValidMobileNumber(
      addPatientDto.phoneNumber
    );
    if (!isPhoneNumberValid) {
      throw new HttpException(
        `${addPatientDto.phoneNumber} is not a valid 10-digit mobile number.`,
        HttpStatus.BAD_REQUEST
      );
    }

    // Check if user with the email already exists
    let user = await this.prisma.user.findUnique({
      where: { email: addPatientDto.email },
    });

    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = await this.prisma.user.create({
        data: {
          email: addPatientDto.email,
          phoneNumber: addPatientDto.phoneNumber,
          firstName: addPatientDto.firstName,
          lastName: addPatientDto.lastName,
          roles: HospitalRoleName.PATIENT,
          isActive: addPatientDto.isActive,
          token: token,
        },
      });
    }

    let patient = await this.prisma.patient.findUnique({
      where: { userId: user.id },
    });

    if (!patient) {
      try {
        patient = await this.prisma.patient.create({
          data: {
            userId: user.id,
            gender: addPatientDto.gender,
            digitalHealthCode: addPatientDto.digitalHealthCode,
            bloodGroup: addPatientDto.bloodGroup,
            age: addPatientDto.age,
            dob: addPatientDto.dob,
            addressLine1: addPatientDto.addressLine1,
            addressLine2: addPatientDto.addressLine2,
            city: addPatientDto.city,
            postalCode: addPatientDto.postalCode,
            countryCode: addPatientDto.countryCode,
            stateCode: addPatientDto.stateCode,
            // isActive:addPatientDto.isActive
          },
        });
      } catch (error) {
        throw new HttpException(
          'Failed to create patient.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }

    const existingPatientHospital =
      await this.prisma.hospitalPatient.findUnique({
        where: {
          hospitalId_patientId: {
            patientId: patient.id,
            hospitalId: hospitalId,
          },
        },
      });

    if (existingPatientHospital) {
      throw new HttpException(
        'Patient is already associated with this hospital',
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      await this.prisma.hospitalPatient.create({
        data: {
          patientId: patient.id,
          hospitalId: hospitalId,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to associate patient with hospital.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Create association in the UserHospitalRole table
    try {
      const patientHospitalRelation = await this.prisma.userHospitalRole.create(
        {
          data: {
            userId: user.id,
            hospitalId: hospitalId,
            hospitalRoleId: 3, // Assuming the role ID for 'Patient' is 3
          },
        }
      );

      if (!patientHospitalRelation) {
        throw new HttpException(
          'Some error while establishing relation between user and hospital',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    } catch (error) {
      console.error('Error creating UserHospitalRole:', error);
      throw new HttpException(
        'Failed to create user-hospital role association.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Associate the patient with the doctor
    const existingDoctorPatient = await this.prisma.doctorPatient.findUnique({
      where: {
        doctorId_patientId: {
          doctorId: doctorId,
          patientId: patient.id,
        },
      },
    });

    if (existingDoctorPatient) {
      throw new HttpException(
        'Patient is already associated with this doctor',
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      await this.prisma.doctorPatient.create({
        data: {
          doctorId: doctorId,
          patientId: patient.id,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to associate patient with doctor.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const resetPasswordLink = `${ADMIN_URL}/update-password/email/${addPatientDto.email}/token/${token}`;
    if (isNewUser) {
      const templateContent = await fs.readFile(
        'apps/api/src/assets/templates/new-patient-template.ejs',
        'utf-8'
      );

      const message = ejs.render(templateContent, {
        firstName: addPatientDto.firstName,
        lastName: addPatientDto.lastName,
        hospitalName: hospital.name,
        resetPasswordLink: resetPasswordLink,
        loginLink: ADMIN_URL,
      });

      const sentMail = await this.notificationService.sendEmail(
        addPatientDto.email,
        'You have been added in ' + hospital.name,
        message
      );
      if (!sentMail)
        throw new HttpException(
          'There is some problem while sending mail',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    } else {
      const templateContent = await fs.readFile(
        'apps/api/src/assets/templates/existing-patient-template.ejs',
        'utf-8'
      );

      const message = ejs.render(templateContent, {
        firstName: user.firstName,
        lastName: user.lastName,
        hospitalName: hospital.name,
        adminLoginLink: ADMIN_URL,
      });

      const sentMail = await this.notificationService.sendEmail(
        user.email,
        'You have been added in ' + hospital.name,
        message
      );

      if (!sentMail)
        throw new HttpException(
          'There is some problem while sending mail',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    return {
      id: patient.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      digitalHealthCode: patient.digitalHealthCode,
      gender: patient.gender,
      age: patient.age,
      bloodGroup: patient.bloodGroup,
      dob: patient.dob,
      addressLine1: patient.addressLine1,
      addressLine2: patient.addressLine2,
      city: patient.city,
      postalCode: patient.postalCode,
      countryCode: patient.countryCode,
      stateCode: patient.stateCode,
      isActive: user.isActive,
    };
  }

  async listPatients(
    hospitalId: number,
    doctorId: number,
    pageSize: number,
    pageOffset: number,
    name: string,
    email: string,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): Promise<ListPatientPageDto> {
    // Ensure the doctor is associated with the specified hospital
    const hospitalDoctorRoleId = await this.prisma.hospitalRole.findFirst({
      where: {
        name: HospitalRoleName.PATIENT,
      },
    });
    const doctor = await this.prisma.doctorHospital.findFirst({
      where: {
        doctorId: doctorId,
        hospitalId: hospitalId,
      },
    });

    if (!doctor) {
      throw new NotFoundException(
        `Doctor with ID ${doctorId} not found in hospital with ID ${hospitalId}`
      );
    }

    const whereArray = [];
    let whereQuery = {};

    whereArray.push({
      hospitalRoles: {
        some: {
          hospitalId: hospitalId,
          hospitalRoleId: hospitalDoctorRoleId.id,
        },
      },
      patient: {
        doctors: {
          some: {
            doctorId: doctorId,
          },
        },
      },
    });

    if (email !== undefined) {
      whereArray.push({ email: { contains: email, mode: 'insensitive' } });
    }

    if (name !== undefined) {
      whereArray.push({
        OR: [
          { firstName: { contains: name, mode: 'insensitive' } },
          { lastName: { contains: name, mode: 'insensitive' } },
        ],
      });
    }

    if (whereArray.length > 0) {
      if (whereArray.length > 1) {
        whereQuery = { AND: whereArray };
      } else {
        whereQuery = whereArray[0];
      }
    }

    const sort = (sortBy ? sortBy : 'id').toString();
    const order = sortOrder ? sortOrder : 'asc';
    const size = pageSize ? pageSize : 10;
    const offset = pageOffset ? pageOffset : 0;
    const orderBy = { [sort]: order };
    const count = await this.prisma.user.count({
      where: whereQuery,
    });

    const listPatients = await this.prisma.user.findMany({
      where: whereQuery,
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        firstName: true,
        isActive: true,
        lastName: true,
        patient: {
          select: {
            userId: true,
            gender: true,
            digitalHealthCode: true,
            age: true,
            bloodGroup: true,
            dob: true,
            addressLine1: true,
            addressLine2: true,
            city: true,
            postalCode: true,
            countryCode: true,
            stateCode: true,
          },
        },
        hospitalRoles: {
          select: {
            hospital: { select: { name: true } },
            hospitalRole: { select: { name: true } },
          },
        },
        superRoles: { select: { superRole: { select: { name: true } } } },
      },
      take: Number(size),
      skip: Number(size * offset),
      orderBy,
    });

    const listPatientsDto = await this.getPatientList(listPatients);

    return {
      size: size,
      number: offset,
      total: count,
      sort: [
        {
          by: sort,
          order: order,
        },
      ],
      content: listPatientsDto,
    };
  }

  private getPatientList(patients): Promise<ListPatientDto[]> {
    if (!patients) {
      throw new BadRequestException();
    } else {
      return patients.map((patient) => ({
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phoneNumber: patient.phoneNumber,
        digitalHealthCode: patient.patient.digitalHealthCode,
        gender: patient.patient.gender,
        age: patient.patient.age,
        bloodGroup: patient.patient.bloodGroup,
        dob: patient.patient.dob,
        addressLine1: patient.patient.addressLine1,
        addressLine2: patient.patient.addressLine2,
        city: patient.patient.city,
        postalCode: patient.patient.postalCode,
        countryCode: patient.patient.countryCode,
        stateCode: patient.patient.stateCode,
        isActive: patient.isActive,
      }));
    }
  }

  async findPatientById(
    hospitalId: number,
    doctorId: number,
    patientId: number
  ): Promise<ViewPatientDto> {
    // Check if the hospital exists
    const hospital = await this.prisma.hospital.findUnique({
      where: { id: hospitalId },
    });
    if (!hospital) {
      throw new HttpException('Hospital not found', HttpStatus.NOT_FOUND);
    }

    // Check if the doctor exists
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new HttpException('Doctor not found', HttpStatus.NOT_FOUND);
    }

    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: true, // Include user details if needed
        doctors: {
          select: {
            doctor: {
              select: {
                doctorCode: true,
              },
            },
          },
        },
      },
    });

    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }

    // Check if the patient is associated with the hospital
    const isPatientAssociated = await this.prisma.hospitalPatient.findUnique({
      where: { hospitalId_patientId: { hospitalId, patientId } },
    });

    if (!isPatientAssociated) {
      throw new HttpException(
        'Patient is not associated with this hospital',
        HttpStatus.FORBIDDEN
      );
    }

    // Check if the patient is associated with the doctor
    const isPatientAssociatedWithDoctor =
      await this.prisma.doctorPatient.findUnique({
        where: { doctorId_patientId: { doctorId, patientId } },
      });

    if (!isPatientAssociatedWithDoctor) {
      throw new HttpException(
        'Patient is not associated with this doctor',
        HttpStatus.FORBIDDEN
      );
    }

    // Extract the first doctorCode if there are multiple doctors
    const doctorCode =
      patient.doctors.length > 0 ? patient.doctors[0].doctor.doctorCode : '';

    return {
      id: patient.id,
      firstName: patient.user.firstName,
      lastName: patient.user.lastName,
      email: patient.user.email,
      phoneNumber: patient.user.phoneNumber,
      gender: patient.gender,
      age: patient.age,
      bloodGroup: patient.bloodGroup,
      doctorCode: doctorCode, // Ensure it matches the expected type
      dob: patient.dob,
      digitalHealthCode: patient.digitalHealthCode,
      addressLine1: patient.addressLine1,
      addressLine2: patient.addressLine2,
      city: patient.city,
      stateCode: patient.stateCode,
      countryCode: patient.countryCode,
      postalCode: patient.postalCode,
      hospitalRoles: [], // Populate this if you have roles
      isActive: patient.user.isActive,
    };
  }

  async updatePatientById(
    hospitalId: number,
    doctorId: number,
    patientId: number,
    updatePatientDto: UpdatePatientDto
  ): Promise<ViewPatientDto> {
    // Check if the hospital exists
    const hospital = await this.prisma.hospital.findUnique({
      where: { id: hospitalId },
    });
    if (!hospital) {
      throw new HttpException('Hospital not found', HttpStatus.NOT_FOUND);
    }

    // Check if the doctor exists
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new HttpException('Doctor not found', HttpStatus.NOT_FOUND);
    }

    // Check if the patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
      include: { user: true },
    });
    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }

    // Check if the patient is associated with the hospital
    const isPatientAssociated = await this.prisma.hospitalPatient.findUnique({
      where: { hospitalId_patientId: { hospitalId, patientId } },
    });
    if (!isPatientAssociated) {
      throw new HttpException(
        'Patient is not associated with this hospital',
        HttpStatus.FORBIDDEN
      );
    }

    // Check if the patient is associated with the doctor
    const isPatientAssociatedWithDoctor =
      await this.prisma.doctorPatient.findUnique({
        where: { doctorId_patientId: { doctorId, patientId } },
      });
    if (!isPatientAssociatedWithDoctor) {
      throw new HttpException(
        'Patient is not associated with this doctor',
        HttpStatus.FORBIDDEN
      );
    }

    // Update the patient's details
    const updatedPatient = await this.prisma.patient.update({
      where: { id: patientId },
      data: {
        gender: updatePatientDto.gender,
        age: updatePatientDto.age,
        bloodGroup: updatePatientDto.bloodGroup,
        dob: updatePatientDto.dob,
        digitalHealthCode: updatePatientDto.digitalHealthCode,
        addressLine1: updatePatientDto.addressLine1,
        addressLine2: updatePatientDto.addressLine2,
        city: updatePatientDto.city,
        stateCode: updatePatientDto.stateCode,
        countryCode: updatePatientDto.countryCode,
        postalCode: updatePatientDto.postalCode,
        user: {
          update: {
            firstName: updatePatientDto.firstName,
            lastName: updatePatientDto.lastName,
            email: updatePatientDto.email,
            phoneNumber: updatePatientDto.phoneNumber,
            isActive: updatePatientDto.isActive,
          },
        },
      },
      include: {
        user: true,
        doctors: {
          select: {
            doctor: {
              select: {
                doctorCode: true,
              },
            },
          },
        },
      },
    });

    // Extract the first doctorCode if there are multiple doctors
    const doctorCode =
      updatedPatient.doctors.length > 0
        ? updatedPatient.doctors[0].doctor.doctorCode
        : '';

    return {
      id: updatedPatient.id,
      firstName: updatedPatient.user.firstName,
      lastName: updatedPatient.user.lastName,
      email: updatedPatient.user.email,
      phoneNumber: updatedPatient.user.phoneNumber,
      gender: updatedPatient.gender,
      age: updatedPatient.age,
      bloodGroup: updatedPatient.bloodGroup,
      doctorCode: doctorCode, // Ensure it matches the expected type
      dob: updatedPatient.dob,
      digitalHealthCode: updatedPatient.digitalHealthCode,
      addressLine1: updatedPatient.addressLine1,
      addressLine2: updatedPatient.addressLine2,
      city: updatedPatient.city,
      stateCode: updatedPatient.stateCode,
      countryCode: updatedPatient.countryCode,
      postalCode: updatedPatient.postalCode,
      hospitalRoles: [], // Populate this if you have roles
      isActive: updatedPatient.user.isActive,
    };
  }

  async deletePatientById(
    hospitalId: number,
    doctorId: number,
    patientId: number
  ): Promise<void> {
    // Check if the hospital exists
    const hospital = await this.prisma.hospital.findUnique({
      where: { id: hospitalId },
    });
    if (!hospital) {
      throw new HttpException('Hospital not found', HttpStatus.NOT_FOUND);
    }

    // Check if the doctor exists
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new HttpException('Doctor not found', HttpStatus.NOT_FOUND);
    }

    // Check if the patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }

    // Check if the patient is associated with the hospital
    const isPatientAssociatedWithHospital =
      await this.prisma.hospitalPatient.findUnique({
        where: { hospitalId_patientId: { hospitalId, patientId } },
      });
    if (!isPatientAssociatedWithHospital) {
      throw new HttpException(
        'Patient is not associated with this hospital',
        HttpStatus.FORBIDDEN
      );
    }

    // Check if the patient is associated with the doctor
    const isPatientAssociatedWithDoctor =
      await this.prisma.doctorPatient.findUnique({
        where: { doctorId_patientId: { doctorId, patientId } },
      });
    if (!isPatientAssociatedWithDoctor) {
      throw new HttpException(
        'Patient is not associated with this doctor',
        HttpStatus.FORBIDDEN
      );
    }

    // Delete the patient-doctor association
    await this.prisma.doctorPatient.deleteMany({
      where: { doctorId, patientId },
    });

    // Delete the patient-hospital association
    await this.prisma.hospitalPatient.deleteMany({
      where: { hospitalId, patientId },
    });

    // Delete the patient record
    await this.prisma.patient.delete({
      where: { id: patientId },
    });

    // Delete the corresponding user record
    await this.prisma.user.delete({
      where: { id: patient.userId },
    });
  }
}
