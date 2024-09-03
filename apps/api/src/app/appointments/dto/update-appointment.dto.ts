import { Appointment } from '@healthcare/data-transfer-types';
import { IsOptional, IsDate, IsEnum, IsNumber } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentDto {
  @IsOptional()
  @ApiProperty()
  appointmentDate: string;

  @ApiProperty()
  @IsNumber()
  statusId: number;
}
