import React from 'react';
import { Box, Typography, FormControlLabel, Checkbox, Card, CardContent, Button } from '@mui/material';

const appointmentTypes = [
  {
    title: 'Introduction',
    description: 'If you need a consultation to get the diagnosis',
  },
  {
    title: 'Problem discussion',
    description: 'If you have a diagnosis and need a therapy',
  },
];

const AppointmentType = () => {
  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom sx={{color:'#064B4F'}}>
        Appointment Type
      </Typography>
      <Box display="flex" gap={1}>
        {appointmentTypes.map((type, index) => (
          <FormControlLabel
            key={index}
            control={<Checkbox />}
            label={
              <Card
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  padding: 2,
                  boxShadow: 'none',
                  minWidth: 200,
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold"sx={{color:'#064B4F'}}>
                    {type.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary"sx={{color:'#064B4F'}}>
                    {type.description}
                  </Typography>
                </CardContent>
                
              </Card>
              
            }
            
          />
          
        ))}
        
      </Box>
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button variant="contained" sx={{
                    backgroundColor: '#064B4F',
                  }}>
          Book Appointment
        </Button>
        
      </Box>
    </Box>
  );
};

export default AppointmentType;
