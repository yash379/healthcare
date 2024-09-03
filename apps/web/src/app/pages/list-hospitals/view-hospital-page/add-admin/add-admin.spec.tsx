import { render } from '@testing-library/react';

import AddAdmin from './add-admin';

interface Form {
  // id: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  isPrimary:boolean;
}

describe('AddAdmin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddAdmin open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onSubmit={function (data: Form): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
