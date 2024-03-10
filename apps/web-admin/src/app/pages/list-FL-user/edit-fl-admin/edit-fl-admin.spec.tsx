import { render } from '@testing-library/react';
import EditFLAdmin from './edit-fl-admin';


interface AddFLuser {
  superRole: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

describe('EditAdmin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditFLAdmin open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onUpdate={function (data: AddFLuser): void {
      throw new Error('Function not implemented.');
    } } initialData={null}  />);
    expect(baseElement).toBeTruthy();
  });
});
