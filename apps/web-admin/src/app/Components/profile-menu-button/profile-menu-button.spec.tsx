import { render } from '@testing-library/react';

import ProfileMenuButton from './profile-menu-button';

describe('ProfileMenuButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProfileMenuButton />);
    expect(baseElement).toBeTruthy();
  });
});
