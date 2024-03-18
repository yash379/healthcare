import { render } from '@testing-library/react';

import DeleteDoctor from './delete-doctor';

describe('DeleteDoctor', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeleteDoctor open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onDelete={function (): void {
      throw new Error('Function not implemented.');
    } } doctorData={null} />);
    expect(baseElement).toBeTruthy();
  });
});
