import { AddDoctor } from '@healthcare/data-transfer-types';
import { OmitType } from '@nestjs/swagger';
import { DoctorDto } from './doctors.dto';

export class AddDoctorDto extends OmitType(DoctorDto, ['id']) implements AddDoctor {}
