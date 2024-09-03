import { render } from '@testing-library/react';

import AddHospitalPage from './add-hospital-page';

describe('AddHospitalPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddHospitalPage />);
    expect(baseElement).toBeTruthy();
  });
});
