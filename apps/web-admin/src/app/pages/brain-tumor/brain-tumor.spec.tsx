import { render } from '@testing-library/react';

import BrainTumor from './brain-tumor';

describe('BrainTumor', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BrainTumor />);
    expect(baseElement).toBeTruthy();
  });
});
