import { Appointment } from '@healthcare/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AppointmentDto implements Appointment {
  @ApiProperty() id: number;

  @ApiProperty()
  appointmentDate: string;

  @ApiProperty()
  @IsNumber()
  statusId: number;
}

export class AppointmentStatusCountsDto {
  pending: number;
  confirmed: number;
  inProgress: number;
  completed: number;
  declined: number;
}
