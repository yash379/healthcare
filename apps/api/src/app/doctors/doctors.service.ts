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
  import { AddDoctorDto } from './dto/add-doctor.dto';
  import { DoctorDto } from './dto/doctors.dto';
  import { ListDoctorPageDto } from './dto/list-doctor-page.dto';
  import { ListDoctorDto } from './dto/list-doctor.dto';
  import { ViewDoctorDto } from './dto/view-doctor.dto';

@Injectable()
export class DoctorsService {
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


    async addDoctor(
        hospitalId: number,
        addDoctorDto: AddDoctorDto
      ): Promise<DoctorDto> {
        if (Number.isNaN(hospitalId)) {
          throw new HttpException(
            'Hospital id is missing in params',
            HttpStatus.BAD_REQUEST
          );
        }
    
        console.log(addDoctorDto, 'adddoctodto data')
        const token = this.generateRandomHexToken(16);
    
        const data = { ...addDoctorDto, token };
    
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
    
        // Check if phone number is valid
        const isPhoneNumberValid = this.isValidMobileNumber(
          addDoctorDto.phoneNumber
        );
        if (!isPhoneNumberValid) {
          throw new HttpException(
            `${addDoctorDto.phoneNumber} is not a valid 10-digit mobile number.`,
            HttpStatus.BAD_REQUEST
          );
        }
    
        // Check if user with the email already exists
        let user = await this.prisma.user.findUnique({
          where: { email: addDoctorDto.email },
        });
    
        let isNewUser = false;
    
        // Before saving to the database
    console.log('Data before saving:', {
      user: {
        email: addDoctorDto.email,
        phoneNumber: addDoctorDto.phoneNumber,
        firstName: addDoctorDto.firstName,
        lastName: addDoctorDto.lastName,
        // password: addDoctorDto.password, // assuming password is hashed
        role: HospitalRoleName.DOCTOR,
        isActive: addDoctorDto.isActive,
        token: token,
      },
      doctor: {
        gender: addDoctorDto.gender,
        doctorCode: addDoctorDto.doctorCode,
        speciality: addDoctorDto.speciality,
      }
    });
    
        if (!user) {
          isNewUser = true;
          // Create a new user if not exists
          user = await this.prisma.user.create({
            data: {
              email: addDoctorDto.email,
              phoneNumber: addDoctorDto.phoneNumber,
              firstName: addDoctorDto.firstName,
              lastName: addDoctorDto.lastName,
              //   password: addDoctorDto.password, // assuming password is hashed
              roles: HospitalRoleName.DOCTOR,
              isActive: addDoctorDto.isActive,
              token: token,
            },
          });
        }
    
        // Check if doctor already exists
        let doctor = await this.prisma.doctor.findUnique({
          where: { userId: user.id },
        });
    
        // If doctor doesn't exist, create a new one
        if (!doctor) {
          try {
            doctor = await this.prisma.doctor.create({
              data: {
                userId: user.id,
                gender: addDoctorDto.gender,
                doctorCode: addDoctorDto.doctorCode,
                speciality: addDoctorDto.speciality,
              },
            });
    
            console.log('Doctor data after saving:', doctor);
          } catch (error) {
            console.error('Error creating doctor:', error);
            throw new HttpException(
              'Failed to create doctor.',
              HttpStatus.INTERNAL_SERVER_ERROR
            );
          }
        }
    
        console.log('Data before creating doctor:', {
          userId: user.id,
          gender: addDoctorDto.gender,
          doctorCode: addDoctorDto.doctorCode,
          speciality: addDoctorDto.speciality,
        });
        
        // Check if doctor is already associated with the hospital in DoctorHospital table
        const existingDoctorHospital = await this.prisma.doctorHospital.findUnique({
          where: {
            doctorId_hospitalId: {
              doctorId: doctor.id,
              hospitalId: hospitalId,
            },
          },
        });
    
        if (existingDoctorHospital) {
          throw new HttpException(
            'Doctor is already associated with this hospital',
            HttpStatus.BAD_REQUEST
          );
        }
    
        // Create association in the DoctorHospital table
        try {
          await this.prisma.doctorHospital.create({
            data: {
              doctorId: doctor.id,
              hospitalId: hospitalId,
            },
          });
        } catch (error) {
          console.error('Error associating doctor with hospital:', error);
          throw new HttpException(
            'Failed to associate doctor with hospital.',
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
    
        // Create association in the UserHospitalRole table
        try {
          const doctorHospitalRelation = await this.prisma.userHospitalRole.create({
            data: {
              userId: user.id,
              hospitalId: hospitalId,
              hospitalRoleId: 2, // Assuming the role ID for 'DOCTOR' is 1
            },
          });
    
          if (!doctorHospitalRelation) {
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
    
        const resetPasswordLink = `${ADMIN_URL}/update-password/email/${addDoctorDto.email}/token/${token}`;
        if (isNewUser) {
          const templateContent = await fs.readFile(
            'apps/api/src/assets/templates/new-doctor-template.ejs',
            'utf-8'
          );
    
          const message = ejs.render(templateContent, {
            firstName: addDoctorDto.firstName,
            lastName: addDoctorDto.lastName,
            hospitalName: hospital.name,
            resetPasswordLink: resetPasswordLink,
            loginLink: ADMIN_URL,
          });
    
          const sentMail = await this.notificationService.sendEmail(
            addDoctorDto.email,
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
            'apps/api/src/assets/templates/existing-doctor-template.ejs',
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
          id: doctor.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          speciality: doctor.speciality,
          gender: doctor.gender,
          doctorCode: doctor.doctorCode,
          isActive: user.isActive,
        };
      }
    
      async updateDoctor(
        updateDoctorDto: AddDoctorDto,
        hospitalId: number,
        doctorId: number
      ): Promise<DoctorDto> {
        if (Number.isNaN(doctorId)) {
          throw new HttpException(
            'Doctor id is missing in params',
            HttpStatus.BAD_REQUEST
          );
        }
      
        // Check if hospital exists
        const hospital = await this.prisma.hospital.findFirst({
          where: { id: hospitalId },
        });
        if (!hospital) {
          throw new HttpException('Hospital not found', HttpStatus.NOT_FOUND);
        }
      
        // Check if doctor exists
        const doctor = await this.prisma.doctor.findUnique({
          where: { userId: doctorId },
          include: { user: true },
        });
        if (!doctor) {
          throw new HttpException('Doctor not found, check doctorId', HttpStatus.NOT_FOUND);
        }
      
        // Check if user associated with the doctor exists
        const user = await this.prisma.user.findUnique({
          where: { id: doctor.userId },
        });
        if (!user) {
          throw new HttpException('User associated with doctor not found', HttpStatus.NOT_FOUND);
        }
      
        // Update user details
        const updatedUser = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            email: updateDoctorDto.email ?? user.email,
            phoneNumber: updateDoctorDto.phoneNumber ?? user.phoneNumber,
            firstName: updateDoctorDto.firstName ?? user.firstName,
            lastName: updateDoctorDto.lastName ?? user.lastName,
            isActive: updateDoctorDto.isActive ?? user.isActive,
          },
        });
      
        // Update doctor details
        const updatedDoctor = await this.prisma.doctor.update({
          where: { userId: doctorId },
          data: {
            gender: updateDoctorDto.gender ?? doctor.gender,
            doctorCode: updateDoctorDto.doctorCode ?? doctor.doctorCode,
            speciality: updateDoctorDto.speciality ?? doctor.speciality,
          },
        });
      
        return {
          id: updatedDoctor.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          speciality: updatedDoctor.speciality,
          gender: updatedDoctor.gender,
          doctorCode: updatedDoctor.doctorCode,
          isActive: updatedUser.isActive,
        };
      }
      
      async getDoctorById(
        hospitalId: number,
        doctorId: number
      ): Promise<ViewDoctorDto> { // Replace with the correct DTO type for doctor details
        const hospitalDoctorRoleId = await this.prisma.hospitalRole.findFirst({
          where: {
            name: HospitalRoleName.DOCTOR,
          },
        });
      
        const doctor = await this.prisma.user.findFirst({
          where: {
            doctor:{
              id: doctorId,
            },
            hospitalRoles: {
              some: {
                hospitalId: hospitalId,
                hospitalRoleId: hospitalDoctorRoleId.id,
              },
            },
          },
          select: {
            id: true,
            email: true,
            phoneNumber: true,
            firstName: true,
            lastName: true,
            isActive: true,
            doctor: {
              select: {
                id: true,
                gender: true,
                doctorCode: true,
                speciality: true,
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
        });
      
        if (!doctor) {
          throw new NotFoundException(`Doctor not found`);
        }
      
        return {
          id: doctor.doctor.id,
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          email: doctor.email,
          phoneNumber: doctor.phoneNumber,
          speciality: doctor.doctor.speciality,
          gender: doctor.doctor.gender,
          doctorCode: doctor.doctor.doctorCode,
          isActive: doctor.isActive,
          hospitalRoles: doctor.hospitalRoles.map((role) => ({
            name: role.hospital.name,
            hospitalRole: role.hospitalRole.name,
          })),
          superRole:
            doctor.superRoles.length > 0
              ? (doctor.superRoles[0].superRole.name as SuperRoleName)
              : undefined,
        };
      }

      async listDoctors(
        hospitalId: number,
        pageSize: number,
        pageOffset: number,
        name: string,
        email: string,
        sortBy: string,
        sortOrder: 'asc' | 'desc'
      ): Promise<ListDoctorPageDto> {
        const hospitalDoctorRoleId = await this.prisma.hospitalRole.findFirst({
          where: {
            name: HospitalRoleName.DOCTOR,
          },
        });
    
        const whereArray = [];
        let whereQuery = {};
    
        whereArray.push({
          hospitalRoles: {
            some: {
              hospitalId: hospitalId,
              hospitalRoleId: hospitalDoctorRoleId.id,
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
    
        const listUsers = await this.prisma.user.findMany({
          where: whereQuery,
          select: {
            id: true,
            email: true,
            phoneNumber: true,
            firstName: true,
            isActive: true,
            lastName: true,
            doctor: {
              select: {
                id:true,
                userId: true,
                gender: true,
                doctorCode: true,
                speciality: true,
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
    
        const listUsersDto = await this.getDoctorList(listUsers);
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
          content: listUsersDto,
        };
      }

      private getDoctorList(listdoctor): Promise<ListDoctorDto[]> {
        if (!listdoctor) {
          throw new BadRequestException();
        } else {
          return listdoctor.map((doctor) => ({
            id: doctor.doctor.id,
            email: doctor.email,
            phoneNumber: doctor.phoneNumber,
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            isActive: doctor.isActive,
            gender: doctor.doctor.gender,
            doctorCode: doctor.doctor.doctorCode,
            speciality: doctor.doctor.speciality,
            hospitalRoles: doctor.hospitalRoles.map((role) => ({
              name: role.hospital.name,
              hospitalRole: role.hospitalRole.name,
            })),
            superRole:
              doctor.superRoles.length > 0
                ? (doctor.superRoles[0].superRole.name as SuperRoleName)
                : undefined,
          }));
        }
      }
    
}



