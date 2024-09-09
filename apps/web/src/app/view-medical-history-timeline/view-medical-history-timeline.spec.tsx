import { render } from '@testing-library/react';

import ViewMedicalHistoryTimeline from './view-medical-history-timeline';

describe('ViewMedicalHistoryTimeline', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ViewMedicalHistoryTimeline />);
    expect(baseElement).toBeTruthy();
  });
});
