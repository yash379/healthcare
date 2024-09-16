import { render } from '@testing-library/react';

import ListDashboardPatients from './list-dashboard-patients';

describe('ListDashboardPatients', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListDashboardPatients />);
    expect(baseElement).toBeTruthy();
  });
});
