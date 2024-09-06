import { AddAppointment } from '@healthcare/data-transfer-types';
import { OmitType } from '@nestjs/swagger';
import { AppointmentDto } from '../dto/appointment.dto';

export class AddAppointmentDto extends OmitType(AppointmentDto, ['id']) implements AddAppointment {}
