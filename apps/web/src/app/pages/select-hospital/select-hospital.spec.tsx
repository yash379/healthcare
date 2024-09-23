import { render } from '@testing-library/react';

import SelectHospital from './select-hospital';

describe('SelectHospital', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SelectHospital />);
    expect(baseElement).toBeTruthy();
  });
});
