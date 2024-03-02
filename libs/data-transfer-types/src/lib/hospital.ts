import { Page } from './page';

export interface Hospital {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  isActive: boolean;

}


export interface ViewHospital {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateCode: string;
  countryCode: string;
  postalCode: string;
  isActive: boolean;
  code: string;

}

export type ListHospital = Pick<Hospital, 'id' | 'name' | 'isActive'>;

export type AddHospital = Omit<Hospital, 'id'>;

export type AddHospitalResponse = Omit<Hospital, 'id' | 'isActive'>;

export type EditHospital = Omit<Hospital, 'id' | 'isActive'>;
export type EditHospitalStatus = Pick<Hospital, 'isActive'>;

export type EditHospitalResponse = Hospital

export type ListHospitalPage = Page<ListHospital>;
