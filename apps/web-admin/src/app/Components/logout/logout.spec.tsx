import { render } from '@testing-library/react';

import Logout from './logout';

describe('Logout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Logout onLogout={function (): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
