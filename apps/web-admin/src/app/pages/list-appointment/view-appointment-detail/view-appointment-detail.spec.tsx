import { render } from '@testing-library/react';

import ViewAppointmentDetail from './view-appointment-detail';

describe('ViewAppointmentDetail', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ViewAppointmentDetail />);
    expect(baseElement).toBeTruthy();
  });
});
