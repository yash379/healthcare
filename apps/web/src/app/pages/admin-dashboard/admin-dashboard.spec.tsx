import { render } from '@testing-library/react';

import AdminDashboard from './admin-dashboard';

describe('AdminDashboard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AdminDashboard />);
    expect(baseElement).toBeTruthy();
  });
});
