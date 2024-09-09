import { Page } from './page';
import {  Gender, HospitalRoleName, SuperRoleName } from '@prisma/client';


export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  // HospitalRole?: HospitalRoleName;
  hospitalRoles?: HospitalRoleDto[];
  superRole?: SuperRoleName;
  doctorId?:number;
  patientId?:number;
}
export interface HospitalRoleDto  {
  hospitalId: number;
  hospitalName?:string;
  hospitalRole: HospitalRoleName;
}

export interface ViewUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  hospitalRoles: ViewHospitalRoleDto[];
  superRole?: SuperRoleName;
  doctorId?:number;
  patientId?:number;
}
export interface ViewAllUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface ViewHospitalRoleDto  {
  name: string;
  hospitalRole: HospitalRoleName;
}





export type ListUser = Pick<
ViewUser,
  | 'id'
  | 'email'
  | 'phoneNumber'
  | 'firstName'
  | 'lastName'
  | 'hospitalRoles'
  | 'superRole'
>;

export type ListAllUser = Pick<
ViewAllUser,
  | 'id'
  | 'email'
  | 'phoneNumber'
  | 'firstName'
  | 'lastName'
>;

export type AddUser = Omit<User, 'id'>;

export type ListUserPage = Page<ListUser>;

