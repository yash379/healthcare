import { render } from '@testing-library/react';

import AddPatient from './add-patient';
import { Gender } from '@prisma/client';

interface Form {
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
  isActive: boolean;
}


describe('AddPatient', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddPatient open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onSubmit={function (data: Form): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
