import { render } from '@testing-library/react';

import PatientDetail from './patient-view';

describe('PatientDetail', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PatientDetail />);
    expect(baseElement).toBeTruthy();
  });
});
