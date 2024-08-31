import { ListDoctor } from '@healthcare/data-transfer-types';
import { PickType } from '@nestjs/swagger';
import { ViewDoctorDto } from './view-doctor.dto';

export class ListDoctorDto
  extends PickType(ViewDoctorDto, [
    'id',
    'email',
    'phoneNumber',
    'firstName',
    'lastName',
    'gender',
    'doctorCode',
    'speciality',
    'hospitalRoles',
    'superRole'
  ])
  implements ListDoctor {}