import { ViewDoctor } from '@healthcare/data-transfer-types';
import { Gender } from '@prisma/client';


export class ViewDoctorDto implements ViewDoctor {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  gender: Gender;
  speciality: string;
  isActive: boolean;
}
