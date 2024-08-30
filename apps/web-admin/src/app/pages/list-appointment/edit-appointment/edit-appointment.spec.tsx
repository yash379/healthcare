import { render } from '@testing-library/react';

import EditAppointment from './edit-appointment';

describe('EditAppointment', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditAppointment />);
    expect(baseElement).toBeTruthy();
  });
});
