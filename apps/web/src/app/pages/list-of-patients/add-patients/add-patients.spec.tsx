import { render } from '@testing-library/react';

import AddPatients from './add-patients';

describe('AddPatients', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddPatients />);
    expect(baseElement).toBeTruthy();
  });
});
