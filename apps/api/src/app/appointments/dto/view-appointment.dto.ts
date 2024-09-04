import { ViewAppointment } from '@healthcare/data-transfer-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';


export class AppointmentStatus {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  code: string;
}
export class UserDetails {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;
}

export class PatientDetails {
  @ApiProperty({ type: UserDetails })
  user: UserDetails;
}

export class ViewAppointmentDto implements ViewAppointment {
  @ApiProperty()
  id: number;

  @ApiProperty()
  appointmentDate: string;

  @ApiProperty({ type: AppointmentStatus })
  status: { id: number; code: string; name: string };

  @ApiProperty({ type: PatientDetails })
  patient: PatientDetails;
}
