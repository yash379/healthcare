import { render } from '@testing-library/react';

import PatientLayout from './patient-layout';

describe('PatientLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PatientLayout />);
    expect(baseElement).toBeTruthy();
  });
});
