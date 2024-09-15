import { render } from '@testing-library/react';

import AdminNav from './admin-nav';

describe('AdminNav', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AdminNav />);
    expect(baseElement).toBeTruthy();
  });
});
