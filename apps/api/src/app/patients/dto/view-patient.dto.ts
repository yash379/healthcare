import {  ViewPatient, ViewHospitalRoleDto } from '@healthcare/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import {  Gender, SuperRoleName } from '@prisma/client';

export class ViewPatientDto implements ViewPatient {
  @ApiProperty() id: number;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty() email: string;
  @ApiProperty() phoneNumber?: string;
  @ApiProperty() gender: Gender;
  @ApiProperty() age: number;
  @ApiProperty() bloodGroup:string;
  @ApiProperty() doctorCode:string;
  @ApiProperty() dob:Date;
  @ApiProperty() digitalHealthCode:string;
  @ApiProperty() addressLine1:string;
  @ApiProperty() addressLine2?:string;
  @ApiProperty() city:string;
  @ApiProperty() stateCode:string;
  @ApiProperty() countryCode:string;
  @ApiProperty() postalCode:string;
  @ApiProperty() hospitalRoles: ViewHospitalRoleDto[];
  @ApiProperty() superRole?: SuperRoleName;
  @ApiProperty() isActive: boolean;
}

export class EditPatientStatus {
  @ApiProperty() isActive: boolean;
}

