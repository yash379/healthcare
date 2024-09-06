import { render } from '@testing-library/react';

import EditHospitalPage from './edit-hospital-page';

describe('EditHospitalPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditHospitalPage />);
    expect(baseElement).toBeTruthy();
  });
});
