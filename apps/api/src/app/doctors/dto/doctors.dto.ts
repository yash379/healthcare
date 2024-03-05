import { Doctor } from '@healthcare/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsBoolean , IsEnum} from 'class-validator';


export class DoctorDto implements Doctor {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsEmail()
  email ?: string;

  @ApiProperty()
  @IsNotEmpty()
  phoneNumber ?: string;

  @ApiProperty()
  @IsNotEmpty()
  speciality: string;
  
  @ApiProperty()
  @IsNotEmpty()
  doctorCode: string;

  @ApiProperty()
  @IsBoolean()
  isActive:boolean
}
