import { Gender } from '@prisma/client';

export enum StatusEnum {
  scheduled = 'Scheduled',
  inProgress = 'In Progress',
  cancelled = 'Cancelled',
  pendingConfirmation = 'Pending Confirmation',
}

export interface Appointment {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  age: number;
  gender: Gender;
  date: Date;
  status: StatusEnum;
}

export interface ViewAppointment {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  age: number;
  gender: Gender;
  date: Date;
  status: StatusEnum;
}

export type AddAppointment = Omit<Appointment, 'id'>;
