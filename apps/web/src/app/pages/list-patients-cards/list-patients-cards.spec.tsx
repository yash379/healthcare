import { render } from '@testing-library/react';

import ListPatientsCards from './list-patients-cards';

describe('ListPatientsCards', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListPatientsCards />);
    expect(baseElement).toBeTruthy();
  });
});
