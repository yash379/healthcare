import { render } from '@testing-library/react';

import HospitalDeleteAppointment from './hospital-delete-appointment';

describe('HospitalDeleteAppointment', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HospitalDeleteAppointment open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onDelete={function (): void {
      throw new Error('Function not implemented.');
    } } appointmentData={null} />);
    expect(baseElement).toBeTruthy();
  });
});
