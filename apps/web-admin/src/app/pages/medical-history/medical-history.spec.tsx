import { render } from '@testing-library/react';

import MedicalHistory from './medical-history';

describe('MedicalHistory', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MedicalHistory />);
    expect(baseElement).toBeTruthy();
  });
});
