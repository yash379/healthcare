import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, Typography } from '@mui/material';
import { css } from '@emotion/react';

const cardStyle = css`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;
`;

const SummaryCard = ({ summary }: { summary: string }) => {
  return (
    <Card css={cardStyle}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Medical Summary
        </Typography>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
