import { ViewAppointment } from '@healthcare/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { AcuteDisease, ChronicDisease, Gender } from '@prisma/client';
import { IsEmail, IsEnum, IsNumber } from 'class-validator';


export class AppointmentStatus {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  code: string;
}
export class UserDetails {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;
}

export class PatientDetails {
  
  @ApiProperty({ type: UserDetails })
  user: UserDetails;
}

export class ViewAppointmentDto implements ViewAppointment {
  @ApiProperty()
  id: number;

  @ApiProperty()
  appointmentDate: string;

  @ApiProperty({ type: AppointmentStatus })
  status: { id: number; code: string; name: string };

  @ApiProperty({ type: PatientDetails })
  patient: PatientDetails;
}


export class UserData {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;
}

export class PatientData {
  @ApiProperty()
  id:number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  phoneNumber?: string;

  @ApiProperty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  age: number;

  @ApiProperty()
  bloodGroup: string;

  @ApiProperty()
  dob: string;

  @ApiProperty()
  digitalHealthCode: string;

  @ApiProperty()
  addressLine1: string;

  @ApiProperty()
  addressLine2: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  stateCode?: string;

  @ApiProperty()
  countryCode: string;

  @ApiProperty()
  postalCode: string;

  @ApiProperty({ type: [String], enum: ChronicDisease, isArray: true })
  @IsEnum(ChronicDisease, { each: true })
  chronicDiseases?: ChronicDisease[];

  @ApiProperty({ type: [String], enum: AcuteDisease, isArray: true })
  @IsEnum(AcuteDisease, { each: true })
  acuteDiseases?: AcuteDisease[];

  @ApiProperty()
  isActive: boolean;
  
}

export class GetAppointmentDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  appointmentDate: string;

  @ApiProperty({ type: AppointmentStatus })
  status: { id: number; code: string; name: string };

  @ApiProperty()
  patientId:number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  phoneNumber?: string;

  @ApiProperty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  age: number;

  @ApiProperty()
  bloodGroup: string;

  @ApiProperty()
  dob: string;

  @ApiProperty()
  digitalHealthCode: string;

  @ApiProperty()
  addressLine1: string;

  @ApiProperty()
  addressLine2: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  stateCode?: string;

  @ApiProperty()
  countryCode: string;

  @ApiProperty()
  postalCode: string;

  @ApiProperty({ type: [String], enum: ChronicDisease, isArray: true })
  @IsEnum(ChronicDisease, { each: true })
  chronicDiseases?: ChronicDisease[];

  @ApiProperty({ type: [String], enum: AcuteDisease, isArray: true })
  @IsEnum(AcuteDisease, { each: true })
  acuteDiseases?: AcuteDisease[];

  @ApiProperty()
  isActive: boolean;
}
