import { render } from '@testing-library/react';

import DeleteAppointment from './delete-appointment';

describe('DeleteAppointment', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeleteAppointment />);
    expect(baseElement).toBeTruthy();
  });
});
