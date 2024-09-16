import { render } from '@testing-library/react';

import LatestPrescription from './latest-prescription';

describe('LatestPrescription', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LatestPrescription />);
    expect(baseElement).toBeTruthy();
  });
});
