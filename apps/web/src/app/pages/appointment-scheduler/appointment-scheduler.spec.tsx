import { render } from '@testing-library/react';

import AppointmentScheduler from './appointment-scheduler';

describe('AppointmentScheduler', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AppointmentScheduler />);
    expect(baseElement).toBeTruthy();
  });
});
