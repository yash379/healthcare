import { render } from '@testing-library/react';

import PatientNav from './patient-nav';

describe('PatientNav', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PatientNav />);
    expect(baseElement).toBeTruthy();
  });
});
