import { AddHospital, AddHospitalResponse, EditHospital, EditHospitalResponse, EditHospitalStatus } from '@healthcare/data-transfer-types';
import { OmitType, PickType } from '@nestjs/swagger';
import { HospitalDto } from './hospital.dto';

export class EditHospitalDto
  extends OmitType(HospitalDto, ['id','isActive','code'])
  implements EditHospital {
}


export class EditHospitalStatusDto
  extends PickType(HospitalDto, ['isActive'])
  implements EditHospitalStatus {
}




