import { Gender, HospitalRoleName, SuperRoleName } from '@prisma/client';
import { Page } from './page';
import { ViewHospitalRoleDto } from './user';

export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: Gender;
  speciality: string;
  doctorCode: string;
  isActive: boolean;
}

// export interface ViewDoctor {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   gender: Gender;
//   speciality: string;
//   doctorCode: string;
//   isActive: boolean;

// }

export interface ViewDoctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: Gender;
  doctorCode:string;
  speciality:string;
  hospitalRoles: ViewHospitalRoleDto[];
  superRole?: SuperRoleName;
}

export type ListDoctor = Pick<
ViewDoctor,
  | 'id'
  | 'email'
  | 'phoneNumber'
  | 'firstName'
  | 'lastName'
  | 'gender'
  | 'doctorCode'
  | 'speciality'
  | 'hospitalRoles'
  | 'superRole'
>;


// export type ListDoctor = Pick<ViewDoctor, 'id' | 'isActive'>;

export type AddDoctor = Omit<Doctor, 'id'>;

export type ListDoctorPage = Page<ListDoctor>;
