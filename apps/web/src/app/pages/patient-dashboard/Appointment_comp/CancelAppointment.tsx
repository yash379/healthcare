

import React from 'react';
import { Box, Typography, Button, Card, CardContent, Avatar } from '@mui/material';

interface AppointmentCardProps {
  doctorName: string;
  date: string;
  time: string;
  specialization: string;
  onCancel: () => void;
  onReschedule: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  doctorName,
  date,
  time,
  specialization,
  onCancel,
  onReschedule,
}) => {
  return (

    <Card
    sx={{
      padding: "20px", 
      maxWidth: "400px", 
      margin: "auto", 
     backgroundColor:'#f9f9f9'
    }}
    >
    <Box sx={{ textAlign: 'left', my: 2, }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#064B4F',fontWeight:'bold' }}>
        Cancel Appointment
      </Typography>
      <Card sx={{ maxWidth: 400, margin: '0 auto', boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              alt="Doctor"
              src="https://via.placeholder.com/50"
              sx={{ width: 56, height: 56, borderRadius: 1 }}
            />
            <Box sx={{ flexGrow: 1, ml: 2, textAlign: 'left',color:'#064B4F' }}>
              <Typography variant="h6">{doctorName}</Typography>
              <Typography variant="body2" color="textSecondary"sx={{color:'#064B4F'}}>
                {date} <br /> {time}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#064B4F', ml: 2 }}>
              {specialization}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={onCancel}
              sx={{ flexGrow: 1, mr: 1 }}
            >
              CANCEL
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={onReschedule}
              sx={{ flexGrow: 1 }}
            >
              RE-SCHEDULE
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
    </Card>
  );
};

const CancellationDetailCard: React.FC = () => {
  const handleCancel = () => {
    console.log('Appointment Canceled');
  };

  const handleReschedule = () => {
    console.log('Appointment Rescheduled');
  };

  return (
    <AppointmentCard
      doctorName="Dr. Rome"
      date="Monday, 16 April"
      time="9:00 - 11:00 am"
      specialization="Neurologist"
      onCancel={handleCancel}
      onReschedule={handleReschedule}
    />
  );
};

export default CancellationDetailCard;
