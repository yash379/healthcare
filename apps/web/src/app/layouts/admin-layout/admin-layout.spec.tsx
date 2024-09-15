import { render } from '@testing-library/react';

import AdminLayout from './admin-layout';

describe('AdminLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AdminLayout />);
    expect(baseElement).toBeTruthy();
  });
});
