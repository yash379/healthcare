import { render } from '@testing-library/react';

// import EditPatient from './edit-patient';
import EditPatientComponent from './edit-patient';
import { AddPatient } from '@healthcare/data-transfer-types';

describe('EditPatient', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditPatientComponent open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onUpdate={function (data: AddPatient): void {
      throw new Error('Function not implemented.');
    } } initialData={null} />);
    expect(baseElement).toBeTruthy();
  });
});
