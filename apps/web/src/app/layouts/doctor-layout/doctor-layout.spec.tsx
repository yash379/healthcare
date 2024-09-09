import { render } from '@testing-library/react';

import DoctorLayout from './doctor-layout';

describe('DoctorLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DoctorLayout />);
    expect(baseElement).toBeTruthy();
  });
});
