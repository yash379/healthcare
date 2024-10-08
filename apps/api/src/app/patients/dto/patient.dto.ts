import { Patient } from '@healthcare/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { AcuteDisease, ChronicDisease, Gender } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class PatientDto implements Patient {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsNotEmpty()
  age: number;

  @ApiProperty()
  @IsNotEmpty()
  bloodGroup: string;

  @ApiProperty()
  @IsNotEmpty()
  dob: string;

  @ApiProperty()
  @IsNotEmpty()
  digitalHealthCode: string;

  @ApiProperty()
  @IsNotEmpty()
  addressLine1: string;

  @ApiProperty()
  addressLine2: string;

  @ApiProperty()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsOptional()
  stateCode?: string;

  @ApiProperty()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ type: [String], enum: ChronicDisease, isArray: true })
  @IsOptional()
  @IsEnum(ChronicDisease, { each: true })
  chronicDiseases?: ChronicDisease[];

  @ApiProperty({ type: [String], enum: AcuteDisease, isArray: true })
  @IsOptional()
  @IsEnum(AcuteDisease, { each: true })
  acuteDiseases?: AcuteDisease[];

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
