import { render } from '@testing-library/react';

import SettingPage from './setting-page';

describe('SettingPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SettingPage />);
    expect(baseElement).toBeTruthy();
  });
});
