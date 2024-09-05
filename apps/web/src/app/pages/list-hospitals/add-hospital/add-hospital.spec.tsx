import { render } from '@testing-library/react';

import AddHospital from './add-hospital';


export interface AddHospital {
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

describe('AddHospital', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddHospital open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onSubmit={function (data: AddHospital): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
