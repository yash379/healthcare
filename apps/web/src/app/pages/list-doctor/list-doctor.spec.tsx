import { render } from '@testing-library/react';
import ListDoctors from './list-doctor';



describe('ListDoctors', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListDoctors />);
    expect(baseElement).toBeTruthy();
  });
});
