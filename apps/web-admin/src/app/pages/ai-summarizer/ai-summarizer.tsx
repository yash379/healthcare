import React from 'react';
import { Typography, Card, CardContent, Divider } from '@mui/material';

export function Summarizer() {
  // Sample summary data
  const summary = {
    majorIssues: "Major issues include Flu, common cold, and Mild Gastritis.",
    latestDiagnosis: "The latest diagnosis is Flu and common cold.",
    summaryText: "The patient has been experiencing symptoms such as fever, cough, and gastritis. Prescriptions included Paracetamol and Cough Syrup for the Flu and Antacid for Gastritis."
  };

  return (
    <div style={{ padding: 20 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Medical History Summary
          </Typography>
          <Divider sx={{ marginY: 2 }} />

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{
              backgroundColor: '#ffe6e6', // Light red background
              padding: '8px',
              borderRadius: '4px',
              fontWeight: 'bold', // Bold text
              marginBottom: '12px' // Gap below the header
            }}
          >
            Major Issues:
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ marginBottom: '16px' }}
          >
            {summary.majorIssues}
          </Typography>

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{
              backgroundColor: '#e0f7fa', // Light cyan background
              padding: '8px',
              borderRadius: '4px',
              fontWeight: 'bold', // Bold text
              marginBottom: '12px' // Gap below the header
            }}
          >
            Latest Diagnosis:
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ marginBottom: '16px' }}
          >
            {summary.latestDiagnosis}
          </Typography>

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{
              fontWeight: 'bold', // Bold text
              marginBottom: '12px' // Gap below the header
            }}
          >
            Summary:
          </Typography>
          <Typography variant="body1">
            {summary.summaryText}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default Summarizer;
