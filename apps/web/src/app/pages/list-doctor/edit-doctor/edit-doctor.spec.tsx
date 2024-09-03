import { render } from '@testing-library/react';

// import EditDoctor from './edit-doctor';
import EditDoctorComponent from './edit-doctor';
import { AddDoctor } from '@healthcare/data-transfer-types';

describe('EditDoctor', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditDoctorComponent open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onUpdate={function (data: AddDoctor): void {
      throw new Error('Function not implemented.');
    } } initialData={null} />);
    expect(baseElement).toBeTruthy();
  });
});
