import { render } from '@testing-library/react';

import AppointmentLayout from './appointment-layout';

describe('AppointmentLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AppointmentLayout />);
    expect(baseElement).toBeTruthy();
  });
});
