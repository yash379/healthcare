import { render } from '@testing-library/react';

import EditPatientPage from './edit-patient-page';

describe('EditPatientPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditPatientPage />);
    expect(baseElement).toBeTruthy();
  });
});
