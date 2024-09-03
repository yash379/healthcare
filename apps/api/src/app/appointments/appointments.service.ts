import { Injectable, NotFoundException } from '@nestjs/common';
import { AddAppointmentDto } from './dto/add-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentDto } from './dto/appointment.dto';
import { ListAppointmentPageDto } from './dto/list-appointment-page.dto';
import { PrismaClient } from '@prisma/client';
import { ViewAppointmentDto } from './dto/view-appointment.dto';

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
        date: data.appointmentDate
        ? new Date(data.appointmentDate) 
        : null,
      },
      include: {
        status: true,
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
    };
  }

  // async listAppointments(
  //   hospitalId: number,
  //   doctorId: number,
  //   patientId: number,
  //   pageSize?: number,
  //   pageOffset?: number,
  //   sortBy: string = 'date',
  //   sortOrder: 'asc' | 'desc' = 'asc'
  // ): Promise<ListAppointmentPageDto> {
  //   // Validate doctor existence
  //   const doctor = await this.prisma.doctor.findUnique({
  //     where: { id: doctorId },
  //   });
  //   if (!doctor) {
  //     throw new NotFoundException('Doctor not found');
  //   }

  //   // Validate patient existence
  //   const patient = await this.prisma.patient.findUnique({
  //     where: { id: patientId },
  //   });
  //   if (!patient) {
  //     throw new NotFoundException('Patient not found');
  //   }

  //   // Count total items
  //   const totalItems = await this.prisma.appointment.count({
  //     where: {
  //       doctorId,
  //       patientId,
  //       doctor: {
  //         hospitals: {
  //           some: { hospitalId },
  //         },
  //       },
  //     },
  //   });

  //   // Find appointments
  //   const appointments = await this.prisma.appointment.findMany({
  //     where: {
  //       doctorId,
  //       patientId,
  //       doctor: {
  //         hospitals: {
  //           some: { hospitalId },
  //         },
  //       },
  //     },
  //     skip: pageOffset,
  //     take: pageSize,
  //     orderBy: {
  //       [sortBy]: sortOrder,
  //     },
  //     include: {
  //       status: true,
  //     },
  //   });

  //   return {
  //     totalItems,
  //     content: appointments.map((appointment) => ({
  //       id: appointment.id,
  //       appointmentDate: appointment.date.toISOString(), // Convert Date object to ISO string
  //       status: {
  //         id: appointment.status.id,
  //         code: appointment.status.code,
  //         name: appointment.status.name,
  //       },
  //     })),
  //   };
  // }

  async findAppointmentById(
    hospitalId: number,
    doctorId: number,
    patientId: number,
    appointmentId: number
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
    };
  }

  // async updateAppointment(
  //   hospitalId: number,
  //   doctorId: number,
  //   patientId: number,
  //   appointmentId: number,
  //   updateAppointmentDto: UpdateAppointmentDto
  // ): Promise<AppointmentDto> {
  //   // Validate doctor existence
  //   const doctor = await this.prisma.doctor.findUnique({
  //     where: { id: doctorId },
  //   });
  //   if (!doctor) {
  //     throw new NotFoundException('Doctor not found');
  //   }

  //   // Validate patient existence
  //   const patient = await this.prisma.patient.findUnique({
  //     where: { id: patientId },
  //   });
  //   if (!patient) {
  //     throw new NotFoundException('Patient not found');
  //   }

  //   // Update appointment
  //   const appointment = await this.prisma.appointment.update({
  //     where: {
  //       id: appointmentId,
  //     },
  //     data: {
  //       date: updateAppointmentDto.appointmentDate
  //         ? new Date(updateAppointmentDto.appointmentDate) // Convert date string to Date object
  //         : undefined,
  //       statusId: updateAppointmentDto.statusId,
  //     },
  //     include: {
  //       status: true,
  //     },
  //   });

  //   return {
  //     id: appointment.id,
  //     appointmentDate: appointment.date.toISOString(), // Convert Date object to ISO string
  //     statusId: appointment.statusId,
  //     status: {
  //       id: appointment.status.id,
  //       code: appointment.status.code,
  //       name: appointment.status.name,
  //     },
  //   };
  // }

  // async deleteAppointment(
  //   hospitalId: number,
  //   doctorId: number,
  //   patientId: number,
  //   appointmentId: number
  // ): Promise<void> {
  //   // Validate doctor existence
  //   const doctor = await this.prisma.doctor.findUnique({
  //     where: { id: doctorId },
  //   });
  //   if (!doctor) {
  //     throw new NotFoundException('Doctor not found');
  //   }

  //   // Validate patient existence
  //   const patient = await this.prisma.patient.findUnique({
  //     where: { id: patientId },
  //   });
  //   if (!patient) {
  //     throw new NotFoundException('Patient not found');
  //   }

  //   // Delete appointment
  //   await this.prisma.appointment.delete({
  //     where: {
  //       id: appointmentId,
  //     },
  //   });
  // }

  async getAppointmentStatuses() {
    return await this.prisma.appointmentStatus.findMany();
  }
}
