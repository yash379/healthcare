import { AddUser } from '@healthcare/data-transfer-types';
import { OmitType } from '@nestjs/swagger';
import { UserDto } from './user.dto';


export class AddUserDto extends OmitType(UserDto, ['id']) implements AddUser {

}
