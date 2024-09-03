import { Page } from './page';

export interface Appointment {
  id: number;
  appointmentDate: string;
  statusId: number;
}

export interface ViewAppointment {
  id: number;
  appointmentDate: string;
  status: { id: number; code: string; name: string };
}

export type ListAppointment = Pick<ViewAppointment, 'id'>;

export type AddAppointment = Omit<Appointment, 'id'>;

export type ListAppointmentPage = Page<ListAppointment>;
