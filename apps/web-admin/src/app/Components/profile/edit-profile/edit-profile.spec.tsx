import { render } from '@testing-library/react';

import EditProfile from './edit-profile';

describe('EditProfile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditProfile editUser={false} userEdit={function (value: boolean): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
