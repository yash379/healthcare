import { render } from '@testing-library/react';

import DashboardAppointments from './dashboard-appointments';

describe('DashboardAppointments', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DashboardAppointments />);
    expect(baseElement).toBeTruthy();
  });
});
