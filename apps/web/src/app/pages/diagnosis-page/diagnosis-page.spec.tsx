import { render } from '@testing-library/react';

import DiagnosisPage from './diagnosis-page';

describe('DiagnosisPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DiagnosisPage />);
    expect(baseElement).toBeTruthy();
  });
});
