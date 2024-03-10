import { render } from '@testing-library/react';

import Login from './login';
import { User } from '@healthcare/data-transfer-types';

describe('Login', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Login onLogin={function (user: User): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
