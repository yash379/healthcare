import { render } from '@testing-library/react';

import AddPatientPage from './add-patient-page';

describe('AddPatientPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddPatientPage />);
    expect(baseElement).toBeTruthy();
  });
});
