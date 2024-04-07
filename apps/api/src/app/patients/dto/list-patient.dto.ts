import { ListPatient } from '@healthcare/data-transfer-types';
import { PickType } from '@nestjs/swagger';
import { ViewPatientDto } from './view-patient.dto';

export class ListPatientDto
  extends PickType(ViewPatientDto, ['id', 'firstName','isActive'])
  implements ListPatient {}
