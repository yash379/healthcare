import { User } from '@healthcare/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
// import { SuperRoleName,HospitalRoleName } from '@prisma/client';
import { IsEmail, IsNotEmpty, MaxLength, } from 'class-validator';
import { HospitalRolesDto } from '../../core/dto/hospitalRoles.dto';
import { HospitalRoleName, SuperRoleName } from '@prisma/client';

export class UserDto implements User {
  @ApiProperty() id: number;

  @IsEmail()
  @MaxLength(250)
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @ApiProperty() lastName: string;

  // @ApiProperty() hospitalRole?: HospitalRoleName

  @ApiProperty()
  hospitalRoles?:HospitalRolesDto[];

  @ApiProperty()
  superRole?: SuperRoleName;

  @ApiProperty() doctorId?: number;
  @ApiProperty() patientId?: number;
}


export class AssetCountDashboardDto  {
  @ApiProperty() Societies: number;

  @ApiProperty()
  Buildings: number;

  @ApiProperty()
  Flats: number;

  @ApiProperty() Residents: number;

  @ApiProperty() Vehicles: number

  @ApiProperty()
  Users:number;

  @ApiProperty()
  Devices: number
}

export class ManagerDto implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;


  @ApiProperty()
  @MaxLength(250)
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  hospitalRoles?:HospitalRolesDto[];

  @ApiProperty()
  superRole?: SuperRoleName;
}


export class AdminCountsDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  active: number;

  @ApiProperty()
  inactive: number;
}
