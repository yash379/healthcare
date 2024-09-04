import { Diagnosis } from "@healthcare/data-transfer-types";
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty,IsEmpty, IsBoolean , IsEnum, IsArray, IsDate, IsOptional} from 'class-validator';


export class DiagnosisDto implements Diagnosis{
    
    @ApiProperty()
    id:number;

    @ApiProperty()
    @IsNotEmpty()
    details: string;

    @ApiProperty()
    doctorId: number;

    @ApiProperty()
    patientId: number;

    @ApiProperty()
    @IsOptional()
    height?: number;

    @ApiProperty()
    @IsOptional()
    weight?: number;

    @ApiProperty()
    @IsOptional()
    pulse?: number;

    @ApiProperty()
    @IsOptional()
    spo2?: number;

    @ApiProperty()
    @IsOptional()
    bmi?: number;

    @ApiProperty()
    @IsOptional()
    temperature?: number;

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    chiefComplaints: string[];

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    diagnosisDate: string; 

}