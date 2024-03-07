import { render } from '@testing-library/react';

import SelectSociety from './select-hospital';

describe('SelectSociety', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SelectSociety />);
    expect(baseElement).toBeTruthy();
  });
});
