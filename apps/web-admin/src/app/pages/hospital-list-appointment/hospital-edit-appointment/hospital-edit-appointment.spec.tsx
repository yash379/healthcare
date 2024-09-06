import { render } from '@testing-library/react';

import HospitalEditAppointment, { Form } from './hospital-edit-appointment';

describe('HospitalEditAppointment', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HospitalEditAppointment open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onUpdate={function (data: Form): void {
      throw new Error('Function not implemented.');
    } } initialData={null} />);
    expect(baseElement).toBeTruthy();
  });
});
