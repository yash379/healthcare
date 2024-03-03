import { Gender } from '@prisma/client';
import { Page } from './page';

export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  gender: Gender;
  speciality: string;
  isActive: boolean;
}

export interface ViewDoctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: Gender;
  speciality: string;
  isChild: boolean;
  isActive: boolean;

}

export type ListDoctor = Pick<ViewDoctor, 'id' | 'isActive'>;

export type AddDoctor = Omit<Doctor, 'id'>;

export type ListDoctorPage = Page<ListDoctor>;
