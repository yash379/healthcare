import { ListAppointment } from '@healthcare/data-transfer-types';
import { PickType } from '@nestjs/swagger';
import { ViewAppointmentDto } from '../dto/view-appointment.dto';

export class ListAppointmentDto
  extends PickType(ViewAppointmentDto, ['id'])
  implements ListAppointment {}
