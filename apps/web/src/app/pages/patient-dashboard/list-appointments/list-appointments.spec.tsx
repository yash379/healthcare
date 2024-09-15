import { render } from '@testing-library/react';

import ListAppointments from './list-appointments';

describe('ListAppointments', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListAppointments />);
    expect(baseElement).toBeTruthy();
  });
});
