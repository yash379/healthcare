import { AcuteDisease, ChronicDisease, Gender } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsEnum,
} from 'class-validator';

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  gender?: Gender;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @IsOptional()
  @IsString()
  dob?: Date;

  @IsOptional()
  @IsString()
  digitalHealthCode?: string;

  @IsOptional()
  @IsString()
  addressLine1?: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  stateCode?: string;

  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsOptional()
  postalCode?: string;

  @IsOptional()
  @IsEnum(ChronicDisease, { each: true })
  chronicDiseases?: ChronicDisease[];

  @IsOptional()
  @IsEnum(AcuteDisease, { each: true })
  acuteDiseases?: AcuteDisease[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
