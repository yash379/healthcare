// UpdateDiagnosisDto.ts
export class UpdateDiagnosisDto {
  details?: string;
  height?: number;
  weight?: number;
  pulse?: number;
  spo2?: number;
  temperature?: number;
  chiefComplaints?: string[];
  diagnosisDate?: string; // ISO string
}
