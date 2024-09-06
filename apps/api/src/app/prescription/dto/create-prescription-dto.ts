// CreatePrescriptionDto.ts
export class CreatePrescriptionDto {
  doctorId: number;
  patientId: number;
  medicineName: string;
  instructions: string;
  dose: string;
  when: string;
  frequency: string;
  duration: string;
  medicalHistoryId?: number;
  prescriptionDate: string;
}
