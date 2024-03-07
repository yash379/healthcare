import { render } from '@testing-library/react';

import HospitalLayout from './hospital-layout';

describe('HospitalLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HospitalLayout />);
    expect(baseElement).toBeTruthy();
  });
});
