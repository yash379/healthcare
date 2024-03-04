import { AddHospital, AddHospitalResponse } from '@healthcare/data-transfer-types';
import { OmitType } from '@nestjs/swagger';
import { HospitalDto } from './hospital.dto';

export class AddHospitalDto
  extends OmitType(HospitalDto, ['id'])
  implements AddHospital {
}


export class AddHospitalResponseDto
extends HospitalDto
implements AddHospitalResponse{

}
