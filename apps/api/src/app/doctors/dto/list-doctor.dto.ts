import { ListDoctor } from '@healthcare/data-transfer-types';
import { PickType } from '@nestjs/swagger';
import { ViewDoctorDto } from './view-doctor.dto';

export class ListDoctorDto
  extends PickType(ViewDoctorDto, ['id', 'name','isActive'])
  implements ListDoctor {}
