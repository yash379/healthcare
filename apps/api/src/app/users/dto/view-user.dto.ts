import { ViewAllUser, ViewDoctor, ViewHospitalRoleDto, ViewUser } from '@healthcare/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, SuperRoleName } from '@prisma/client';
// import { SuperRoleName } from '@prisma/client';

export class ViewUserDto implements ViewUser {
  @ApiProperty() id: number;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty() email: string;
  @ApiProperty() isActive: boolean;
  @ApiProperty() phoneNumber: string;
  @ApiProperty() hospitalRoles: ViewHospitalRoleDto[];
  @ApiProperty() superRole?: SuperRoleName;
  @ApiProperty() doctorId?: number;
  @ApiProperty() patientId?: number;
}

export class ViewAllUserDto implements ViewAllUser {
  @ApiProperty() id: number;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty() email: string;
  @ApiProperty() isActive: boolean;
  @ApiProperty() phoneNumber: string;
}

export class EditUserStatus {
  @ApiProperty() isActive: boolean;
}

export class ViewManagerDto implements ViewUser {
  @ApiProperty() id: number;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty() email: string;
  @ApiProperty() isActive: boolean;
  @ApiProperty() phoneNumber: string;
  @ApiProperty() hospitalRoles: ViewHospitalRoleDto[];
  @ApiProperty() superRole?: SuperRoleName;
}

export class EditManagerStatus {
  @ApiProperty() isActive: boolean;
}


