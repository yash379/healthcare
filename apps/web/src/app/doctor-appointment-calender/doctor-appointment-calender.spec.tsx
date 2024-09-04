import { render } from '@testing-library/react';

import DoctorAppointmentCalender from './doctor-appointment-calender';

describe('DoctorAppointmentCalender', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DoctorAppointmentCalender />);
    expect(baseElement).toBeTruthy();
  });
});
