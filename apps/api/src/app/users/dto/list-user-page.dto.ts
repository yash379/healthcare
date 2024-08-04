import { ListDoctorPage, ListUserPage } from '@healthcare/data-transfer-types';
import {  ListManagerDto, ListUserDto } from './list-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PageBaseDto } from '../../core/dto/page-base.dto';

export class ListUserPageDto extends PageBaseDto implements ListUserPage {
  @ApiProperty({ type: [ListUserDto] }) content: ListUserDto[];
}



export class ListManagerPageDto extends PageBaseDto implements ListUserPage {
  @ApiProperty({ type: [ListManagerDto] }) content: ListManagerDto[];
}