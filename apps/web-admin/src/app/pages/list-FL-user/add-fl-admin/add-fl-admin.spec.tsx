import { render } from '@testing-library/react';

import AddFLAdmin from './add-fl-admin';

interface AddFLuser {
  superRole: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

describe('AddAdmin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddFLAdmin open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onSubmit={function (data: AddFLuser): void {
      throw new Error('Function not implemented.');
    } }  />);
    expect(baseElement).toBeTruthy();
  });
});
