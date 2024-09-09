import { render } from '@testing-library/react';

import Customevent from './customevent';

describe('Customevent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Customevent />);
    expect(baseElement).toBeTruthy();
  });
});
