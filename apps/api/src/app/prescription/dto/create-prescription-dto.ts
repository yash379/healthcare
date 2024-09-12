// CreatePrescriptionDto.ts
// export class CreatePrescriptionDto {
//   doctorId: number;
//   patientId: number;
//   medicineName: string;
//   instructions: string;
//   dose: string;
//   when: string;
//   frequency: string;
//   duration: string;
//   medicalHistoryId?: number;
//   prescriptionDate: string;
// }

// Ensure that all imports are at the top of the file
import { IsNumber, IsString, IsDateString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

// DTO for a single medicine
export class CreateMedicineDto {
  @IsString()
  medicineName: string;

  @IsString()
  instructions: string;

  @IsString()
  dose: string;

  @IsString()
  when: string;

  @IsString()
  frequency: string;

  @IsString()
  duration: string;
}

// DTO for a single prescription with medicines
export class CreatePrescriptionDto {
  @IsNumber()
  doctorId: number;

  @IsNumber()
  patientId: number;

  @IsOptional() // medicalHistoryId is optional based on your schema
  @IsNumber()
  medicalHistoryId?: number;

  @IsDateString()
  prescriptionDate: string; // ISO 8601 format

  // Array of medicines associated with this prescription
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMedicineDto)
  medicines: CreateMedicineDto[];
}

// Wrapper DTO for multiple prescriptions
export class CreatePrescriptionsWrapperDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionDto)
  prescriptions: CreatePrescriptionDto[];
}
