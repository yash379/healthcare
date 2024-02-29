import { Page } from './page';

export interface User {
  id: number;
  referenceId: string;
  name:string;
  email: string;
  phoneNumber: string;
  role:any[];
  isActive: boolean;
}

export interface ViewUser {
    id: number;
    name:string;
    email: string;
    phoneNumber: string;
    role:any[];
    isActive: boolean;
}

export type ListUser = Pick<
  ViewUser,
  | 'id'
  | 'name'
  | 'role'
  | 'email'
  | 'phoneNumber'
  | 'isActive'
>;

export type AddUser = Pick<User, 'referenceId' >;

export type ListUserPage = Page<ListUser>;
