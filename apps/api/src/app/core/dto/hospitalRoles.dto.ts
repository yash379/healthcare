import { HospitalRoleDto,ViewHospitalRoleDto } from '@healthcare/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { HospitalRoleName } from '@prisma/client';

export class HospitalRolesDto implements HospitalRoleDto {
  @ApiProperty() hospitalId: number;
  @ApiProperty() hospitalRole: HospitalRoleName;
}

export class ViewHospitalRolesDto implements ViewHospitalRoleDto {
  @ApiProperty() name: string;
  @ApiProperty() hospitalRole: HospitalRoleName;
}
