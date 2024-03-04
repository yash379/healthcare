import { ListHospital } from '@healthcare/data-transfer-types';
import { PickType } from '@nestjs/swagger';
import { HospitalDto } from './hospital.dto';

export class ListHospitalDto
  extends PickType(HospitalDto, ['id', 'name','city','addressLine1','addressLine2','stateCode','countryCode','postalCode', 'isActive','code'])
  implements ListHospital {}
