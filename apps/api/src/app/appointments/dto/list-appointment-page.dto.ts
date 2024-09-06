import { ListAppointmentPage } from '@healthcare/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { PageBaseDto } from '../../core/dto/page-base.dto';
import { ListAppointmentDto } from '../dto/list-appointment.dto';

export class ListAppointmentPageDto extends PageBaseDto implements ListAppointmentPage {
  @ApiProperty({ type: [ListAppointmentDto] })
  content: ListAppointmentDto[];
}
