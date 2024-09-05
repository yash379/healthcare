import { render } from '@testing-library/react';

import ListHospitals from './list-hospitals';

describe('ListHospitals', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListHospitals />);
    expect(baseElement).toBeTruthy();
  });
});
