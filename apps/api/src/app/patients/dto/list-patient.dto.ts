import { ListPatient } from '@healthcare/data-transfer-types';
import { PickType } from '@nestjs/swagger';
import { ViewPatientAllDetailsDto, ViewPatientDto } from './view-patient.dto';

export class ListPatientDto
  extends PickType(ViewPatientDto, [
    'id',
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'gender',
    'age',
    'bloodGroup',
    'dob',
    'digitalHealthCode',
    'addressLine1',
    'addressLine2',
    'city',
    'stateCode',
    'countryCode',
    'postalCode',
    'chronicDisease',
    'acuteDisease',
    'hospitalRoles',
    'superRole',
  ])
  implements ListPatient {}

  export class ListPatientAllDetailsDto
  extends PickType(ViewPatientAllDetailsDto, [
    'id',
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'gender',
    'age',
    'bloodGroup',
    'dob',
    'digitalHealthCode',
    'addressLine1',
    'addressLine2',
    'city',
    'stateCode',
    'countryCode',
    'postalCode',
    'chronicDisease',
    'acuteDisease',
    'doctorId',
    'doctorFirstName',
    'doctorLastName',
    'doctorEmail',
    'doctorPhoneNumber',
    'hospitalRoles',
    'superRole',
  ])
  implements ListPatient {}