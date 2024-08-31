import { Gender } from '@prisma/client';
import { ChronicDisease } from '@prisma/client';
import { AcuteDisease } from '@prisma/client';
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
  digitalHealthCode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  chronicDisease?:ChronicDisease;
  acuteDisease?:AcuteDisease;
  isActive: boolean;
  age: number;
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
  digitalHealthCode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  chronicDisease?:ChronicDisease;
  acuteDisease?:AcuteDisease;
  isActive: boolean;

}

export type ListPatient = Pick<ViewPatient, 'id' | 'isActive'>;

export type AddPatient = Omit<Patient, 'id'>;

export type ListPatientPage = Page<ListPatient>;
