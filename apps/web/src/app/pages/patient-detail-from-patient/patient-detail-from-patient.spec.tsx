import { render } from '@testing-library/react';

import PatientDetailFromPatient from './patient-detail-from-patient';

describe('PatientDetailFromPatient', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PatientDetailFromPatient />);
    expect(baseElement).toBeTruthy();
  });
});
