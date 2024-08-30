import { render } from '@testing-library/react';

import ListAppointment from './list-appointment';

describe('ListAppointment', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListAppointment />);
    expect(baseElement).toBeTruthy();
  });
});
