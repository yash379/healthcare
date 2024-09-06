import { render } from '@testing-library/react';

import HospitalAddAppointment, { Form } from './hospital-add-appointment';

describe('HospitalAddAppointment', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HospitalAddAppointment open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onSubmit={function (data: Form): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
