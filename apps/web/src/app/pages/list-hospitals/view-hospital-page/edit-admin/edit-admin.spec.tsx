import { render } from '@testing-library/react';
import EditAdmin from './edit-admin';


interface Manager {
  id: number;
  isPrimary: boolean;
  hospitalRole: {
    name: string;
  },
  user: {
    id: number;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
  }
}


describe('EditAdmin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditAdmin open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onUpdate={function (data: Manager): void {
      throw new Error('Function not implemented.');
    } } initialData={null}  />);
    expect(baseElement).toBeTruthy();
  });
});
