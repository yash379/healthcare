import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, Typography, Divider } from '@mui/material';
import { css } from '@emotion/react';

const cardStyle = css`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #f9f9f9;
  font-family: 'Roboto', sans-serif;
`;

const markdownStyles = css`
  h1, h2, h3 {
    color: #3d2d5a;
    font-weight: bold;
    margin-top: 20px;
  }

  p {
    line-height: 1.6;
    font-size: 1.1rem;
    color: #4a4a4a;
    margin-bottom: 12px;
  }

  strong {
    color: #1e88e5;
    font-weight: 600;
  }

  em {
    color: #e53935;
    font-style: italic;
  }

  blockquote {
    padding: 10px 20px;
    margin: 20px 0;
    border-left: 5px solid #eee;
    background: #f7f7f7;
    font-style: italic;
  }

  ul {
    list-style-type: disc;
    margin-left: 20px;
  }

  code {
    background-color: #f5f5f5;
    padding: 3px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
  }
`;

const SummaryCard = ({ summary }: { summary: string }) => {
  return (
    <Card css={cardStyle}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Medical Summary
        </Typography>
        <Divider style={{ margin: '10px 0' }} />
        <div css={markdownStyles}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
