import { render } from '@testing-library/react';

import AiSummarizer from './ai-summarizer';

describe('AiSummarizer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AiSummarizer />);
    expect(baseElement).toBeTruthy();
  });
});
