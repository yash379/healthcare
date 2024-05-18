import { OrganizationRoleDto,ViewOrganizationRoleDto } from '@healthcare/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
// import { OrganizationRoleName } from '@prisma/client';

export class OrganizationRolesDto implements OrganizationRoleDto {
  @ApiProperty() organizationId: number;
  // @ApiProperty() organizationRole: OrganizationRoleName;
}

export class ViewOrganizationRolesDto implements ViewOrganizationRoleDto {
  @ApiProperty() name: string;
  // @ApiProperty() organizationRole: OrganizationRoleName;
}
