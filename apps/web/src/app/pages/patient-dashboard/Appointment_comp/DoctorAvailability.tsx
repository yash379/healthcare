import React from 'react';
import { Box, Typography, FormControlLabel, Checkbox, CardContent, Avatar } from '@mui/material';

const availabilities = [
  {
    doctor: 'Dr. Rome',
    date: 'Monday, 16 April',
    time: '9:00 - 11:00 am',
    imgSrc: 'https://via.placeholder.com/50', // You can replace this with the actual image source
  },
  {
    doctor: 'Dr. Rome',
    date: 'Monday, 16 April',
    time: '9:00 - 11:00 am',
    imgSrc: 'https://via.placeholder.com/50', // You can replace this with the actual image source
  },
  {
    doctor: 'Dr. Rome',
    date: 'Monday, 16 April',
    time: '9:00 - 11:00 am',
    imgSrc: 'https://via.placeholder.com/50', // You can replace this with the actual image source
  },
  {
    doctor: 'Dr. Rome',
    date: 'Monday, 16 April',
    time: '9:00 - 11:00 am',
    imgSrc: 'https://via.placeholder.com/50', // You can replace this with the actual image source
  },
];

const DoctorAvailability = () => {
  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
      <Typography variant="h6" gutterBottom sx={{color:'#064B4F', mt:'-12px', mb:'21px'}}>
        Select Doctor Availability
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {availabilities.map((availability, index) => (
          // <FormControlLabel
          //   key={index}
          //   control={<Checkbox />}
          //   label={
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 2,
                  paddingLeft: '10px',
                  textAlign: 'center',
                  boxShadow: 2,
                  // width: '250px', // Adjust the width if needed
                }}
              >
                <Avatar
                  alt={availability.doctor}
                  src={availability.imgSrc}
                  sx={{ width: 50, height: 50, marginRight: 2 }}
                />
                <CardContent>
                  <Typography variant="subtitle1"sx={{color:'#064B4F'}}>{availability.doctor}</Typography>
                  <Typography variant="body2" color="textSecondary"sx={{color:'#064B4F'}}>
                    {availability.date}
                  </Typography>
                  <Typography variant="body2" color="textSecondary"sx={{color:'#064B4F'}}>
                    {availability.time}
                  </Typography>
                </CardContent>
              </Box>
            // }
          // />
        ))}
      </Box>
    </Box>
  );
};

export default DoctorAvailability;
