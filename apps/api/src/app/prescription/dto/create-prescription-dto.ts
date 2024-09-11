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

// Single prescription DTO
import { IsNumber, IsString, IsDateString } from 'class-validator';

export class CreatePrescriptionDto {
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

  @IsNumber()
  doctorId: number;

  @IsNumber()
  patientId: number;

  @IsDateString()
  prescriptionDate: string; // ISO 8601 format
}

// Wrapper DTO for multiple prescriptions
import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';

export class CreatePrescriptionsWrapperDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionDto)
  prescriptions: CreatePrescriptionDto[];
}
