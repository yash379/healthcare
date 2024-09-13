import { ListPrescription } from '@healthcare/data-transfer-types';
import { PickType } from '@nestjs/swagger';
import {   ViewPrescriptionDto } from './view-prescription.dto';

export class ListPrescriptionDto
  extends PickType(ViewPrescriptionDto, [
    'id',
    'doctorId',
    'patientId',
    'prescriptionDate'
  ])
  implements ListPrescription {}
