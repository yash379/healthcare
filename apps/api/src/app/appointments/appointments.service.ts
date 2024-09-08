import { Injectable, NotFoundException } from '@nestjs/common';
import { AddAppointmentDto } from './dto/add-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentDto } from './dto/appointment.dto';
import { ListAppointmentPageDto } from './dto/list-appointment-page.dto';
import { PrismaClient } from '@prisma/client';
import {
  GetAppointmentDto,
  ViewAppointmentDto,
} from './dto/view-appointment.dto';

@Injectable()
export class AppointmentsService {
  private prisma = new PrismaClient();

  async createAppointment(
    hospitalId: number,
    doctorId: number,
    patientId: number,
    data: AddAppointmentDto
  ): Promise<ViewAppointmentDto> {
    const hospital = await this.prisma.hospital.findUnique({
      where: { id: hospitalId },
    });
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    // Check if doctor exists
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Check if patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Check if statusId exists
    const status = await this.prisma.appointmentStatus.findUnique({
      where: { id: data.statusId },
    });
    if (!status) {
      throw new NotFoundException('Status not found');
    }

    // Create the appointment
    const appointment = await this.prisma.appointment.create({
      data: {
        doctorId,
        patientId,
        statusId: data.statusId,
        date: data.appointmentDate ? new Date(data.appointmentDate) : null,
      },
      include: {
        status: true,
        patient: {
          include: {
            user: true,
          },
        },
      },
    });

    return {
      id: appointment.id,
      appointmentDate: appointment.date.toISOString(), // Convert Date object to ISO string
      // statusId: appointment.statusId,
      status: {
        id: status.id,
        code: status.code,
        name: status.name,
      },
      patient: {
        user: {
          id: appointment.patient.user.id,
          firstName: appointment.patient.user.firstName,
          lastName: appointment.patient.user.lastName,
          email: appointment.patient.user.email,
          phoneNumber: appointment.patient.user.phoneNumber,
        },
      },
    };
  }

  async listAppointments(
    hospitalId: number,
    doctorId: number,
    patientId: number,
    pageSize: number,
    pageOffset: number,
    appointmentDate: string,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): Promise<ListAppointmentPageDto> {
    const hospital = await this.prisma.hospital.findUnique({
      where: { id: hospitalId },
    });
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    // Validate doctor existence
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Validate patient existence
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const whereArray = [];
    let whereQuery = {};

    if (appointmentDate !== undefined) {
      whereArray.push({
        appointmentDate: { contains: appointmentDate, mode: 'insensitive' },
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
    const count = await this.prisma.appointment.count({
      where: whereQuery,
    });
    // Find appointments
    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        patientId,
        doctor: {
          hospitals: {
            some: { hospitalId },
          },
        },
      },
      take: Number(size),
      skip: Number(size * offset),
      orderBy,
      include: {
        status: true,
        patient: {
          include: {
            user: true,
          },
        },
      },
    });

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
      content: appointments.map((appointment) => ({
        id: appointment.id,
        appointmentDate: appointment.date.toISOString(), // Convert Date object to ISO string
        status: {
          id: appointment.status.id,
          code: appointment.status.code,
          name: appointment.status.name,
        },
        patient: {
          user: {
            id: appointment.patient.user.id,
            firstName: appointment.patient.user.firstName,
            lastName: appointment.patient.user.lastName,
            email: appointment.patient.user.email,
            phoneNumber: appointment.patient.user.phoneNumber,
          },
        },
      })),
    };
  }

  async listDoctorAppointments(
    hospitalId: number,
    doctorId: number,
    // patientId: number,
    pageSize: number,
    pageOffset: number,
    appointmentDate: string,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): Promise<ListAppointmentPageDto> {
    const hospital = await this.prisma.hospital.findUnique({
      where: { id: hospitalId },
    });
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    // Validate doctor existence
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const whereArray = [];
    let whereQuery = {};

    if (appointmentDate !== undefined) {
      whereArray.push({
        appointmentDate: { contains: appointmentDate, mode: 'insensitive' },
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
    const count = await this.prisma.appointment.count({
      where: whereQuery,
    });
    // Find appointments
    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        // patientId,
        doctor: {
          hospitals: {
            some: { hospitalId },
          },
        },
      },
      take: Number(size),
      skip: Number(size * offset),
      orderBy,
      include: {
        status: true,
        patient: {
          include: {
            user: true,
          },
        },
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

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
      content: appointments.map((appointment) => ({
        id: appointment.id,
        appointmentDate: appointment.date.toISOString(), // Convert Date object to ISO string
        status: {
          id: appointment.status.id,
          code: appointment.status.code,
          name: appointment.status.name,
        },
        patient: {
          user: {
            id: appointment.patient.id,
            firstName: appointment.patient.user.firstName,
            lastName: appointment.patient.user.lastName,
            email: appointment.patient.user.email,
            phoneNumber: appointment.patient.user.phoneNumber,
          },
        },
        doctor: {
          user: {
            id: appointment.doctor.id,
            firstName: appointment.doctor.user.firstName,
            lastName: appointment.doctor.user.lastName,
            email: appointment.doctor.user.email,
            phoneNumber: appointment.doctor.user.phoneNumber,
          },
        },
      })),
    };
  }

  async listHospitalAppointments(
    hospitalId: number,
    pageSize: number,
    pageOffset: number,
    appointmentDate: string,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): Promise<ListAppointmentPageDto> {
    const hospital = await this.prisma.hospital.findUnique({
      where: { id: hospitalId },
    });
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    const whereArray = [];
    let whereQuery = {};

    if (appointmentDate !== undefined) {
      whereArray.push({
        appointmentDate: { contains: appointmentDate, mode: 'insensitive' },
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
    const count = await this.prisma.appointment.count({
      where: whereQuery,
    });
    // Find appointments
    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctor: {
          hospitals: {
            some: { hospitalId },
          },
        },
      },
      take: Number(size),
      skip: Number(size * offset),
      orderBy,
      include: {
        status: true,
        patient: {
          include: {
            user: true,
          },
        },
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

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
      content: appointments.map((appointment) => ({
        id: appointment.id,
        appointmentDate: appointment.date.toISOString(), // Convert Date object to ISO string
        status: {
          id: appointment.status.id,
          code: appointment.status.code,
          name: appointment.status.name,
        },
        patient: {
          user: {
            id: appointment.patient.id,
            firstName: appointment.patient.user.firstName,
            lastName: appointment.patient.user.lastName,
            email: appointment.patient.user.email,
            phoneNumber: appointment.patient.user.phoneNumber,
          },
        },
        doctor: {
          user: {
            id: appointment.doctor.id,
            firstName: appointment.doctor.user.firstName,
            lastName: appointment.doctor.user.lastName,
            email: appointment.doctor.user.email,
            phoneNumber: appointment.doctor.user.phoneNumber,
          },
        },
      })),
    };
  }

  async findAppointmentById(
    hospitalId: number,
    doctorId: number,
    patientId: number,
    appointmentId: number
  ): Promise<GetAppointmentDto> {
    const hospital = await this.prisma.hospital.findUnique({
      where: { id: hospitalId },
    });
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    // Validate doctor existence
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Validate patient existence
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Find appointment by ID
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        doctorId,
        patientId,
        doctor: {
          hospitals: {
            some: { hospitalId },
          },
        },
      },
      include: {
        status: true,
        patient: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const status = await this.prisma.appointmentStatus.findUnique({
      where: { id: appointment.statusId },
    });
    if (!status) {
      throw new NotFoundException('Status not found');
    }

    return {
      id: appointment.id,
      appointmentDate: appointment.date.toISOString(), // Convert Date object to ISO string
      // statusId: appointment.statusId,
      status: {
        id: status.id,
        code: status.code,
        name: status.name,
      },
      patientId: appointment.patient.id,
      digitalHealthCode: appointment.patient.digitalHealthCode,
      gender: appointment.patient.gender,
      age: appointment.patient.age,
      bloodGroup: appointment.patient.bloodGroup,
      dob: appointment.patient.dob.toISOString(),
      addressLine1: appointment.patient.addressLine1,
      addressLine2: appointment.patient.addressLine2,
      city: appointment.patient.city,
      stateCode: appointment.patient.stateCode,
      countryCode: appointment.patient.countryCode,
      postalCode: appointment.patient.postalCode,
      chronicDiseases: appointment.patient.chronicDiseases,
      acuteDiseases: appointment.patient.acuteDiseases,
      isActive: appointment.patient.user.isActive,
      firstName: appointment.patient.user.firstName,
      lastName: appointment.patient.user.lastName,
      email: appointment.patient.user.email,
      phoneNumber: appointment.patient.user.phoneNumber,
    };
  }

  async updateAppointment(
    hospitalId: number,
    doctorId: number,
    patientId: number,
    appointmentId: number,
    updateAppointmentDto: UpdateAppointmentDto
  ): Promise<ViewAppointmentDto> {
    const hospital = await this.prisma.hospital.findUnique({
      where: { id: hospitalId },
    });
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    // Validate doctor existence
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Validate patient existence
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Update appointment
    const appointment = await this.prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        date: updateAppointmentDto.appointmentDate
          ? new Date(updateAppointmentDto.appointmentDate)
          : null,
        statusId: updateAppointmentDto.statusId,
      },
      include: {
        status: true,
        patient: {
          include: {
            user: true,
          },
        },
      },
    });

    const status = await this.prisma.appointmentStatus.findUnique({
      where: { id: appointment.statusId },
    });
    if (!status) {
      throw new NotFoundException('Status not found');
    }

    return {
      id: appointment.id,
      appointmentDate: appointment.date.toISOString(),
      status: {
        id: status.id,
        code: status.code,
        name: status.name,
      },
      patient: {
        user: {
          id: appointment.patient.user.id,
          firstName: appointment.patient.user.firstName,
          lastName: appointment.patient.user.lastName,
          email: appointment.patient.user.email,
          phoneNumber: appointment.patient.user.phoneNumber,
        },
      },
    };
  }

  async deleteAppointment(
    hospitalId: number,
    doctorId: number,
    patientId: number,
    appointmentId: number
  ): Promise<void> {
    const hospital = await this.prisma.hospital.findUnique({
      where: { id: hospitalId },
    });
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    // Validate doctor existence
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Validate patient existence
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Delete appointment
    await this.prisma.appointment.delete({
      where: {
        id: appointmentId,
      },
    });
  }

  async getAppointmentStatuses() {
    return await this.prisma.appointmentStatus.findMany();
  }

  async getAppointmentCounts(hospitalId: number): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    cancelled: number;
    confirmed: number;
  }> {
    const total = await this.prisma.appointment.count({
      where: {
        doctor: {
          hospitals: {
            some: { hospitalId },
          },
        },
      },
    });

    const pending = await this.prisma.appointment.count({
      where: {
        status: {
          code: '1', // PENDING
        },
      },
    });

    const inProgress = await this.prisma.appointment.count({
      where: {
        status: {
          code: '2', // INPROGRESS
        },
      },
    });

    const cancelled = await this.prisma.appointment.count({
      where: {
        status: {
          code: '3', // CANCELLED
        },
      },
    });

    const confirmed = await this.prisma.appointment.count({
      where: {
        status: {
          code: '4', // CONFIRMED
        },
      },
    });

    return {
      total,
      pending,
      inProgress,
      cancelled,
      confirmed,
    };
  }
}
