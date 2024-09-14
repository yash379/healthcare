import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MedicalHistoryService {
  private prisma = new PrismaClient();

  async getMedicalHistory(patientId: number) {
    // Fetch the medical history record for the patient
    const medicalHistory = await this.prisma.medicalHistory.findUnique({
      where: { id: patientId },
      include: {
        diagnoses: {
          orderBy: {
            diagnosisDate: 'asc', // Sort diagnoses by diagnosisDate
          },
        },
        prescriptions: {
          include: {
            medicines: true, // Include medicines for each prescription
          },
          orderBy: {
            prescriptionDate: 'asc', // Sort prescriptions by prescriptionDate
          },
        },
      },
    });
  
    if (!medicalHistory) {
      throw new NotFoundException(
        'Medical history not found for the given patient.'
      );
    }
  
    // Group diagnoses and prescriptions by diagnosisDate/prescriptionDate
    const groupedData = medicalHistory.diagnoses.map((diagnosis) => {
      const relatedPrescriptions = medicalHistory.prescriptions.filter(
        (prescription) =>
          new Date(prescription.prescriptionDate).toDateString() ===
          new Date(diagnosis.diagnosisDate).toDateString()
      );
  
      return {
        diagnosisDate: diagnosis.diagnosisDate,
        diagnosisDetails: diagnosis,
        relatedPrescriptions: relatedPrescriptions,
      };
    });
  
    return {
      id: medicalHistory.id,
      patientId: medicalHistory.patientId,
      createdAt: medicalHistory.createdAt,
      updatedAt: medicalHistory.updatedAt,
      groupedData,
    };
  }
  
}
