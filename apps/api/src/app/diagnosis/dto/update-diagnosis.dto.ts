import { IsOptional, IsString } from "class-validator";


export class UpdateDiagnosisDto{
    @IsOptional()
    @IsString()
    id?: number;

    @IsOptional()
    @IsString()
    details?: string;

    @IsOptional()
    @IsString()
    doctorId?: number;

    @IsOptional()
    @IsString()
    patientId?: number;

    @IsOptional()
    @IsString()
    height?: number;

    @IsOptional()
    @IsString()
    weight?: number;

    @IsOptional()
    @IsString()
    pulse?: number;

    @IsOptional()
    @IsString()
    spo2?: number;

    @IsOptional()
    @IsString()
    bmi?: number;

    @IsOptional()
    @IsString()
    temperature?: number;

    @IsOptional()
    @IsString()
    chiefComplaints?: string[];

    @IsOptional()
    @IsString()
    diagnosisDate?: string;
}