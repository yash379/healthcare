import { IsString, IsOptional, IsBoolean, IsEmail } from 'class-validator';

export class UpdateDoctorDto {
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
    gender?: string;

    @IsOptional()
    @IsString()
    doctorCode?: string;

    @IsOptional()
    @IsString()
    speciality?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}