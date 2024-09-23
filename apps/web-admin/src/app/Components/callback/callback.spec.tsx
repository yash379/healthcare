import { render } from '@testing-library/react';

import Callback from './callback';

describe('Callback', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Callback
        onLogin={() => {
          return;
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
