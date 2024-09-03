import { render } from '@testing-library/react';

import DeleteHospital from './delete-hospital';

describe('DeleteHospital', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeleteHospital open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onDelete={function (): void {
      throw new Error('Function not implemented.');
    } } hospitalData={undefined} />);
    expect(baseElement).toBeTruthy();
  });
});
