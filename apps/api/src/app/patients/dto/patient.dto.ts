import { Patient } from '@healthcare/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsBoolean , IsEnum} from 'class-validator';


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
  email ?: string;

  @ApiProperty()
  @IsNotEmpty()
  phoneNumber ?: string;

  @ApiProperty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsNotEmpty()
  bloodgroup: string;

  @ApiProperty()
  @IsNotEmpty()
  dob: Date;

  @ApiProperty()
  @IsNotEmpty()
  digitalHealthCode: string;

  @ApiProperty()
  @IsNotEmpty()
  addressLine1: string;

  @ApiProperty()
  @IsNotEmpty()
  addressLine2 ?: string;

  @ApiProperty()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  stateCode ?: string;

  @ApiProperty()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty()
  @IsBoolean()
  isActive:boolean
}
