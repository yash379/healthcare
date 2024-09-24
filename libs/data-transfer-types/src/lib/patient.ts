import { Gender, SuperRoleName } from '@prisma/client';
import { ChronicDisease } from '@prisma/client';
import { AcuteDisease } from '@prisma/client';
import { Page } from './page';
import { ViewHospitalRoleDto } from './user';

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  gender: Gender;
  age: number;
  bloodGroup: string;
  dob: string;
  digitalHealthCode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  chronicDisease?: ChronicDisease[]; // Array of ChronicDisease enums
  acuteDisease?: AcuteDisease[]; // Array of AcuteDisease enums
  isActive: boolean;
}

export interface ViewPatient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  gender: Gender;
  age: number;
  bloodGroup: string;
  dob: string;
  digitalHealthCode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  chronicDisease?: ChronicDisease[]; // Array of ChronicDisease enums
  acuteDisease?: AcuteDisease[]; // Array of AcuteDisease enums
  isActive: boolean;
  hospitalRoles: ViewHospitalRoleDto[];
  superRole?: SuperRoleName;
}

export type ListPatient = Pick<
  ViewPatient,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phoneNumber'
  | 'gender'
  | 'age'
  | 'bloodGroup'
  | 'dob'
  | 'digitalHealthCode'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'stateCode'
  | 'countryCode'
  | 'postalCode'
  | 'chronicDisease'
  | 'acuteDisease'
  | 'hospitalRoles'
  | 'superRole'
>;

// export type ListPatient = Pick<ViewPatient, 'id' | 'isActive'>;

export type AddPatient = Omit<Patient, 'id'>;

export type ListPatientPage = Page<ListPatient>;
