import { render } from '@testing-library/react';

import AddDoctor from './add-doctor';
import { Gender } from '@prisma/client';

interface Form {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  phoneNumber: string;
  doctorCode: string;
  speciality: string;
  isActive: boolean,
}


describe('AddDoctor', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddDoctor open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onSubmit={function (data: Form): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
