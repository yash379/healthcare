import { ListAllUser, ListDoctor, ListUser } from '@healthcare/data-transfer-types';
import { PickType } from '@nestjs/swagger';
import {  ViewManagerDto, ViewUserDto } from './view-user.dto';

export class ListUserDto
  extends PickType(ViewUserDto, [
    'id',
    'email',
    'phoneNumber',
    'firstName',
    'lastName',
    'hospitalRoles',
    'superRole'
  ])
  implements ListUser {}

  export class ListAllUserDto
  extends PickType(ViewUserDto, [
    'id',
    'email',
    'phoneNumber',
    'firstName',
    'lastName',
  ])
  implements ListAllUser {}


  export class ListManagerDto
  extends PickType(ViewManagerDto, [
    'id',
    'email',
    'phoneNumber',
    'firstName',
    'lastName',
    'hospitalRoles',
    'superRole'
  ])
  implements ListUser {}
  