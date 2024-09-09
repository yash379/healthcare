import { render } from '@testing-library/react';

import HospitalListAppointment from './hospital-list-appointment';

describe('HospitalListAppointment', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HospitalListAppointment />);
    expect(baseElement).toBeTruthy();
  });
});
