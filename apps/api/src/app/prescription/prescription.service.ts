import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePrescriptionDto, CreatePrescriptionsWrapperDto } from './dto/create-prescription-dto';
import { UpdatePrescriptionDto } from './dto/update-prescription-dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrescriptionService {
  private prisma = new PrismaClient();

  // async create(dto: CreatePrescriptionDto) {
  //   const doctorPatient = await this.prisma.doctorPatient.findUnique({
  //     where: {
  //       doctorId_patientId: {
  //         patientId: dto.patientId,
  //         doctorId: dto.doctorId
  //       },
  //     },
  //   });

  //   if (!doctorPatient) {
  //     throw new BadRequestException('Doctor and Patient are not associated.');
  //   }

  //   const prescriptionDate = new Date(dto.prescriptionDate);

  //   return this.prisma.prescription.create({
  //     data: {
  //       ...dto,
  //       prescriptionDate,
  //     },
  //   });
  // }

  async create(dto: CreatePrescriptionsWrapperDto) {
    for (const prescription of dto.prescriptions) {
      if (!prescription.doctorId || !prescription.patientId) {
        throw new BadRequestException('Doctor ID and Patient ID must be provided.');
      }

      // Log the IDs to ensure they are being passed correctly
      console.log(`Processing prescription for Doctor ID: ${prescription.doctorId}, Patient ID: ${prescription.patientId}`);

      const doctorPatient = await this.prisma.doctorPatient.findUnique({
        where: {
          doctorId_patientId: {
            doctorId: prescription.doctorId,
            patientId: prescription.patientId,
          },
        },
      });

      if (!doctorPatient) {
        throw new BadRequestException('Doctor and Patient are not associated.');
      }

      const prescriptionDate = new Date(prescription.prescriptionDate);

      await this.prisma.prescription.create({
        data: {
          ...prescription,
          prescriptionDate,
        },
      });
    }
    return { message: 'Prescriptions created successfully' };
  }

  async update(id: number, dto: UpdatePrescriptionDto) {
    const data: any = { ...dto };
    if (dto.prescriptionDate) {
      data.prescriptionDate = new Date(dto.prescriptionDate);
    }

    return this.prisma.prescription.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.prescription.delete({
      where: { id },
    });
  }

  async getById(id: number) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found.');
    }

    return {
      ...prescription,
      prescriptionDate: prescription.prescriptionDate.toISOString(),
    };
  }

  async getAll() {
    const prescriptions = await this.prisma.prescription.findMany();
    return prescriptions.map((prescription) => ({
      ...prescription,
      prescriptionDate: prescription.prescriptionDate.toISOString(),
    }));
  }
}
