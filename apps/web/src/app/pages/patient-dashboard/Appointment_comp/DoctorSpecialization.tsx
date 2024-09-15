import React from 'react';
import { Box, Typography, Button, FormControlLabel, Checkbox, Link } from '@mui/material';

const specializations = [
  'Cardiologist',
  'Pediatricians',
  'Neurologist',
  'Dermatologist',
  'Oncologist',
  'Nephrologist',
  'Pulmonologist',
];

const DoctorSpecialization = () => {
  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column'}}>
      <Typography variant="h4" gutterBottom sx={{color:'#064B4F'}}>
        Schedule Appointment
      </Typography>
      <Typography variant="h6" gutterBottom sx={{color:'#064B4F'}}>
        Select Doctor Specialization
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          width:'106%'
          // justifyContent: 'space-between',
        }}
      >
        {specializations.map((specialization, index) => (
          <FormControlLabel
            key={index}
            control={<Checkbox />}
            label={
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 2,
                  backgroundColor: '#46707e',
                  color: 'white',
                  padding: '10px 20px',
                  minWidth: '150px',
                  textAlign: 'center',
                }}
              >
                {specialization}
              </Box>
            }
          />
        ))}
      </Box>
      <Box mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="text" sx={{ color: '#007bff' }}>
        <Link href="#" underline="none" color="blue" fontSize="0.875rem" 
        sx={{
          textDecoration: "underline",
        }}
        >
          See all specialization
        </Link>
        </Button>
      </Box>
    </Box>
  );
};

export default DoctorSpecialization;
