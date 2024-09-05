import { render } from '@testing-library/react';

import AddAppointment from './add-appointment';

describe('AddAppointment', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddAppointment />);
    expect(baseElement).toBeTruthy();
  });
});
