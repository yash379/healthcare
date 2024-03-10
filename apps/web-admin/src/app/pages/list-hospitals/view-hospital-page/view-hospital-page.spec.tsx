import { render } from '@testing-library/react';

import ViewHospitalPage from './view-hospital-page';

describe('ViewHospitalPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ViewHospitalPage />);
    expect(baseElement).toBeTruthy();
  });
});
