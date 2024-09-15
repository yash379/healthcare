import { render } from '@testing-library/react';
import ListPatients from './list-patient';



describe('ListPatients', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListPatients />);
    expect(baseElement).toBeTruthy();
  });
});
