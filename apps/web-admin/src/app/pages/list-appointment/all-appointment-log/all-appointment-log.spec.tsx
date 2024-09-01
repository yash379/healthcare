import { render } from '@testing-library/react';

import AllAppointmentLog from './all-appointment-log';

describe('AllAppointmentLog', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AllAppointmentLog />);
    expect(baseElement).toBeTruthy();
  });
});
