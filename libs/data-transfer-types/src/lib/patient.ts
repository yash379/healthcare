import { Gender } from '@prisma/client';
import { Page } from './page';

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  gender: Gender;
  bloodgroup: string;
  dob: Date;
  digitalHeathCode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  isActive: boolean;
}

export interface ViewPatient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: Gender;
  bloodgroup: string;
  dob: Date;
  digitalHeathCode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  isChild: boolean;
  isActive: boolean;

}

export type ListPatient = Pick<ViewPatient, 'id' | 'isActive'>;

export type AddPatient = Omit<Patient, 'id'>;

export type ListPatientPage = Page<ListPatient>;
