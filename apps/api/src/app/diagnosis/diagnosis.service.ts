import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateDiagnosisDto } from './dto/create-diagnosis-dto';
import { UpdateDiagnosisDto } from './dto/update-diagnosis-dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DiagnosisService {
  private prisma = new PrismaClient();

  async create(dto: CreateDiagnosisDto) {
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

    return this.prisma.diagnosis.create({
      data: {
        ...dto,
        diagnosisDate: new Date(dto.diagnosisDate), // Convert to Date
      },
    });
  }

  async update(id: number, dto: UpdateDiagnosisDto) {
    return this.prisma.diagnosis.update({
      where: { id },
      data: {
        ...dto,
        diagnosisDate: dto.diagnosisDate
          ? new Date(dto.diagnosisDate)
          : undefined, // Convert to Date if provided
      },
    });
  }

  async delete(id: number) {
    return this.prisma.diagnosis.delete({
      where: { id },
    });
  }

  async getById(id: number) {
    const diagnosis = await this.prisma.diagnosis.findUnique({
      where: { id },
    });

    if (!diagnosis) {
      throw new NotFoundException('Diagnosis not found.');
    }

    return {
      ...diagnosis,
      diagnosisDate: diagnosis.diagnosisDate.toISOString(), // Convert to ISO string
    };
  }

  async getAll() {
    const diagnoses = await this.prisma.diagnosis.findMany();
    return diagnoses.map((diagnosis) => ({
      ...diagnosis,
      diagnosisDate: diagnosis.diagnosisDate.toISOString(), // Convert to ISO string
    }));
  }
}
