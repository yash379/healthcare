import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MedicalHistoryService {
  private prisma = new PrismaClient();

  async getMedicalHistory(patientId: number) {
    // Fetch the medical history record for the patient
    const medicalHistory = await this.prisma.medicalHistory.findUnique({
      where: { id:patientId },
      include: {
        diagnoses: true, // Include related diagnoses
        prescriptions: {
          include: {
            medicines: true, // Include medicines for each prescription
          },
        },
      },
    });

    if (!medicalHistory) {
      throw new NotFoundException(
        'Medical history not found for the given patient.'
      );
    }

    return medicalHistory;
  }
}
