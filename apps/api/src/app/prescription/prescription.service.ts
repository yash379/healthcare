import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePrescriptionDto } from './dto/create-prescription-dto';
import { UpdatePrescriptionDto } from './dto/update-prescription-dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrescriptionService {
  private prisma = new PrismaClient();

  async create(dto: CreatePrescriptionDto) {
    const doctorPatient = await this.prisma.doctorPatient.findUnique({
      where: {
        doctorId_patientId: {
          doctorId: dto.doctorId,
          patientId: dto.patientId,
        },
      },
    });

    if (!doctorPatient) {
      throw new BadRequestException('Doctor and Patient are not associated.');
    }

    const prescriptionDate = new Date(dto.prescriptionDate);

    return this.prisma.prescription.create({
      data: {
        ...dto,
        prescriptionDate,
      },
    });
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
