// view-appointment-detail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography, Box, Avatar, Divider, Card } from '@mui/material';
import styles from './view-appointment-detail.module.scss';
import { Gender } from '@prisma/client';
import { StatusEnum } from '../pages/list-appointment/list-appointment';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined';

interface ViewAppointment {
  id: number;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  gender: string; // Adjust if using Gender enum
  status: string; // Adjust if using StatusEnum
  age: number;
  date: Date;
}

const dummyAppointments: ViewAppointment[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    mobileNumber: '1234567890',
    email: 'john.doe@example.com',
    gender: Gender.MALE,
    status: StatusEnum.InProgress,
    age: 30,
    date: new Date(),
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    mobileNumber: '0987654321',
    email: 'jane.smith@example.com',
    gender: Gender.FEMALE,
    status: StatusEnum.InProgress,
    age: 25,
    date: new Date(),
  },
  // More dummy data...
];

const ViewAppointmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState<ViewAppointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = () => {
      const appointmentData = dummyAppointments.find(app => app.id === Number(id));
      if (appointmentData) {
        setAppointment(appointmentData);
      } else {
        console.error('Appointment not found');
      }
      setLoading(false);
    };

    fetchAppointment();
  }, [id]);

  if (loading) return <div>Loading...</div>;


  if (!appointment) {
    return <div>Appointment not found</div>;
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <Box className={styles['container']}
      sx={{ display: 'flex' }}
    >
      <Paper sx={{ padding: 3, width: '50rem', backgroundColor: '#f8f9fa', borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: '#4FD1C5', width: 60, height: 60, fontSize: '24px', mr: 2 }}>
            {getInitials(appointment.firstName, appointment.lastName)}
          </Avatar>
          <Typography variant="h5" sx={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 'bold' }}>
            {`${appointment.firstName} ${appointment.lastName}`}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 'bold' }}>
            Gender: <Typography component="span" sx={{ fontWeight: 'normal' }}>{appointment.gender}</Typography>
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 'bold' }}>
            Age: <Typography component="span" sx={{ fontWeight: 'normal' }}>{appointment.age}</Typography>
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 'bold' }}>
            Email: <Typography component="span" sx={{ fontWeight: 'normal' }}>{appointment.email}</Typography>
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 'bold' }}>
            Mobile Number: <Typography component="span" sx={{ fontWeight: 'normal' }}>{appointment.mobileNumber}</Typography>
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 'bold' }}>
            Date: <Typography component="span" sx={{ fontWeight: 'normal' }}>{appointment.date.toDateString()}</Typography>
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 'bold' }}>
            Status: <Typography component="span" sx={{ fontWeight: 'normal' }}>{appointment.status}</Typography>
          </Typography>
        </Box>
      </Paper>
      <Box sx={{marginTop:'40px'}}>
        <Box sx={{marginBottom:'25px'}}>
          <Box sx={{ width: '300px', ml: '30px' }}>
            <Card
              sx={{
                display: 'flex',
                // justifyContent: 'space-between',
                alignItems: 'center',
                height: '60px', // Adjust this value to increase the height
                padding: '16px', // Optional: add padding for better spacing inside the card
                borderRadius: '20px',
                boxShadow: '-moz-initial'
              }}
            >
              <Avatar sx={{ background: '#F4F7FE', width: 56, height: 56 }}>
                <MedicalInformationOutlinedIcon
                  sx={{
                    width: 36,
                    height: 36,
                    color: 'black'
                  }}
                />
              </Avatar>
              <Typography sx={{ color: '#0B4FA6', fontFamily: 'DM Sans, sans-serif', fontWeight: 'bold', ml: '40px' }}>
                Medical History
              </Typography>
            </Card>
          </Box>

        </Box>
        <Box sx={{ width: '300px', ml: '30px' }}>
          <Card
            sx={{
              display: 'flex',
              // justifyContent: 'space-between',
              alignItems: 'center',
              height: '60px', // Adjust this value to increase the height
              padding: '16px', // Optional: add padding for better spacing inside the card
              borderRadius: '20px',
              boxShadow: '-moz-initial'
            }}
          >
            <Avatar sx={{ background: '#F4F7FE', width: 56, height: 56 }}>
              <MonitorHeartOutlinedIcon
                sx={{
                  width: 36,
                  height: 36,
                  color: 'black'
                }}
              />
            </Avatar>
            <Typography sx={{ color: '#139C94', fontFamily: 'DM Sans, sans-serif', fontWeight: 'bold', ml: '40px' }}>
              Start Diagnosis
            </Typography>
          </Card>
        </Box>
      </Box>


    </Box>
  );
};

export default ViewAppointmentDetail;
