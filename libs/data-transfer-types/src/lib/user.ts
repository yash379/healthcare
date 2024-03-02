import { Page } from './page';
import {  HospitalRoleName, SuperRoleName } from '@prisma/client';


export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  HospitalRole?: HospitalRoleName;
  superRole?: SuperRoleName;
}

export interface ViewUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  superRole?: SuperRoleName;
}



export type ListUser = Pick<
ViewUser,
  | 'id'
  | 'email'
  | 'phoneNumber'
  | 'firstName'
  | 'lastName'
  | 'superRole'
>;

export type AddUser = Omit<User, 'id'>;

export type ListUserPage = Page<ListUser>;
