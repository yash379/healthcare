import {  ViewDoctor, ViewHospitalRoleDto } from '@healthcare/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import {  Gender, SuperRoleName } from '@prisma/client';

export class ViewDoctorDto implements ViewDoctor {
  @ApiProperty() id: number;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty() email: string;
  @ApiProperty() isActive: boolean;
  @ApiProperty() phoneNumber: string;
  @ApiProperty() gender: Gender;
  @ApiProperty() doctorCode:string;
  @ApiProperty() speciality:string;
  @ApiProperty() hospitalRoles: ViewHospitalRoleDto[];
  @ApiProperty() superRole?: SuperRoleName;
}

export class EditDoctorStatus {
  @ApiProperty() isActive: boolean;
}

