import { render } from '@testing-library/react';

import DoctorNav from './doctor-nav';

describe('DoctorNav', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DoctorNav />);
    expect(baseElement).toBeTruthy();
  });
});
