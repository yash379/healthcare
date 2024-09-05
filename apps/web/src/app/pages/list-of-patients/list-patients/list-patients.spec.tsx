import { render } from '@testing-library/react';

import ListPatients from './list-patients';

describe('ListPatients', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListPatients />);
    expect(baseElement).toBeTruthy();
  });
});
