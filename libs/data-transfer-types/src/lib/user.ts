import { Page } from './page';
import {  HospitalRoleName, SuperRoleName } from '@prisma/client';


export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  // HospitalRole?: HospitalRoleName;
  hospitalRoles?: HospitalRoleDto[];
  superRole?: SuperRoleName;
}
export interface HospitalRoleDto  {
  hospitalId: number;
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

export type AddUser = Omit<User, 'id'>;

export type ListUserPage = Page<ListUser>;
