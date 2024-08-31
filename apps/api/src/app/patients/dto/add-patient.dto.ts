import { AddPatient } from '@healthcare/data-transfer-types';
import { OmitType } from '@nestjs/swagger';
import { PatientDto } from './patient.dto';

export class AddPatientDto extends OmitType(PatientDto, ['id']) implements AddPatient {}

