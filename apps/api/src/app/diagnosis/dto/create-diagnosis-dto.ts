export class CreateDiagnosisDto {
  doctorId: number;
  patientId: number;
  details: string;
  height?: number;
  weight?: number;
  pulse?: number;
  spo2?: number;
  temperature?: number;
  chiefComplaints: string[];
  diagnosisDate: string; // ISO string
  medicalHistoryId?: number; // Optional

}
