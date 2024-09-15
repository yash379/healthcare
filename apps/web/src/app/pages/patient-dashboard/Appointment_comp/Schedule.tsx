import { Box, Divider } from '@mui/material';
import React from 'react';
import DoctorSpecialization from './DoctorSpecialization';
import DoctorAvailability from './DoctorAvailability';
import AppointmentType from './AppointmentType';

function Schedule() {
  return (
    
      <Box
        sx={{          
          // border: '1px solid #ccc',
          // borderBottom: 'opx solid white',
          // boxShadow:'20px solid #ccc',
          // boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" ,
          // borderRadius:'10px',
          }}>
        <DoctorSpecialization/>
        <Divider sx={{ my: 2, }} />
        <DoctorAvailability/>
        <Divider sx={{ my: 2 }} />
        <AppointmentType/>
      </Box>
    
  );
}

export default Schedule;
