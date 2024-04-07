import { render } from '@testing-library/react';

import DeletePatient from './delete-patient';

describe('DeletePatient', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeletePatient open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onDelete={function (): void {
      throw new Error('Function not implemented.');
    } } patientData={null} />);
    expect(baseElement).toBeTruthy();
  });
});
