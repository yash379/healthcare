import { render } from '@testing-library/react';

import DashboardChart from './dashboard-chart';

describe('DashboardChart', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DashboardChart />);
    expect(baseElement).toBeTruthy();
  });
});
