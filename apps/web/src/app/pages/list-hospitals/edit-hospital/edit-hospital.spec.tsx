import { render } from '@testing-library/react';

import EditHospital, { AddHospital } from './edit-hospital';

describe('EditHospital', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditHospital open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onUpdate={function (data: AddHospital): void {
      throw new Error('Function not implemented.');
    } } initialData={null} />);
    expect(baseElement).toBeTruthy();
  });
});
