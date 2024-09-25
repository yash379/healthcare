import { render } from '@testing-library/react';

import SaranshAi from './saransh-ai';

describe('SaranshAi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SaranshAi />);
    expect(baseElement).toBeTruthy();
  });
});
