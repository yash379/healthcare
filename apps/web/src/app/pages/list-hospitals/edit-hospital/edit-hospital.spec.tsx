import { render } from '@testing-library/react';

import EditSociety from './edit-hospital';

describe('EditSociety', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditSociety />);
    expect(baseElement).toBeTruthy();
  });
});
