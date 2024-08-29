import {Appointment} from '@healthcare/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsBoolean , IsEnum, isNotEmpty, IsOptional} from 'class-validator';

export class AppointmentDto implements Appointment {
 @ApiProperty()
 id:number;

 @ApiProperty()
 @IsNotEmpty()
 firstName: string;

 @ApiProperty()
 @IsNotEmpty()
 lastName: string;

 @ApiProperty()
 @IsNotEmpty()
 @IsEmail()
 email: string;

 @ApiProperty()
 @IsEnum(Gender)
 gender: Gender;

 @ApiProperty()
 @IsOptional()
 mobileNumber?: string;

 @ApiProperty()
 @IsNotEmpty()
 age: number;

 @ApiProperty()
 @IsNotEmpty()
 date: Date;

}
