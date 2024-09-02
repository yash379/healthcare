// view-appointment-detail.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Avatar,
  Divider,
  Card,
  Grid,
} from '@mui/material';
import styles from './view-appointment-detail.module.scss';
import { Gender } from '@prisma/client';
import { StatusEnum } from '../list-appointment';
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
    firstName: 'Omkar',
    lastName: 'Patil',
    mobileNumber: '1234567890',
    email: 'omkar.patil@example.com',
    gender: Gender.MALE,
    status: StatusEnum.InProgress,
    age: 32,
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointment = () => {
      const appointmentData = dummyAppointments.find(
        (app) => app.id === Number(id)
      );
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

  const handleClick = () => {
    navigate('/medical-history');
  };

  const handleStartDiagnosisClick = () => {
    navigate('/diagnosis');
  };

  return (
    <Box className={styles['container']} sx={{ display: 'flex' }}>
      <Paper
        sx={{
          padding: 3,
          width: '60rem',
          backgroundColor: '#f8f9fa',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: '#4FD1C5',
              width: 60,
              height: 60,
              fontSize: '24px',
              mr: 2,
            }}
          >
            {getInitials(appointment.firstName, appointment.lastName)}
          </Avatar>
          <Typography
            variant="h5"
            sx={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 'bold' }}
          >
            {`${appointment.firstName} ${appointment.lastName}`}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Grid
          sx={{ mb: '10px' }}
          container
          rowSpacing={2}
          spacing={1}
          columns={2}
        >
          <Grid
            item
            xs={1}
            md={1}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography variant="subtitle1" sx={{ mr: '20px' }}>
              Gender:
            </Typography>
          </Grid>

          <Grid
            item
            xs={1}
            md={1}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography
              variant="body1"
              sx={{
                textWrap: 'wrap',
                lineBreak: 'anywhere',
                whiteSpace: 'break-spaces',
              }}
            >
              {appointment.gender}
            </Typography>
          </Grid>
          <Grid
            item
            xs={1}
            md={1}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography variant="subtitle1" sx={{ mr: '20px' }}>
              Age:
            </Typography>
          </Grid>

          <Grid
            item
            xs={1}
            md={1}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography
              variant="body1"
              sx={{
                textWrap: 'wrap',
                lineBreak: 'anywhere',
                whiteSpace: 'break-spaces',
              }}
            >
              {appointment.age}
            </Typography>
          </Grid>

          <Grid
            item
            xs={1}
            md={1}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography variant="subtitle1" sx={{ mr: '20px' }}>
              Email:
            </Typography>
          </Grid>

          <Grid
            item
            xs={1}
            md={1}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography
              variant="body1"
              sx={{
                textWrap: 'wrap',
                lineBreak: 'anywhere',
                whiteSpace: 'break-spaces',
              }}
            >
              {appointment.email}
            </Typography>
          </Grid>

          <Grid
            item
            xs={1}
            md={1}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography variant="subtitle1" sx={{ mr: '20px' }}>
              Mobile Number:
            </Typography>
          </Grid>

          <Grid
            item
            xs={1}
            md={1}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography
              variant="body1"
              sx={{
                textWrap: 'wrap',
                lineBreak: 'anywhere',
                whiteSpace: 'break-spaces',
              }}
            >
              {appointment.mobileNumber}
            </Typography>
          </Grid>
          <Grid
            item
            xs={1}
            md={1}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography variant="subtitle1" sx={{ mr: '20px' }}>
              Date:
            </Typography>
          </Grid>

          <Grid
            item
            xs={1}
            md={1}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography
              variant="body1"
              sx={{
                textWrap: 'wrap',
                lineBreak: 'anywhere',
                whiteSpace: 'break-spaces',
              }}
            >
              {appointment.date.toDateString()}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          sx={{ mb: '10px' }}
          container
          rowSpacing={2}
          spacing={1}
          columns={2}
        >
          <Grid
            item
            xs={1}
            md={1}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography variant="subtitle1" sx={{ mr: '20px' }}>
              Status:
            </Typography>
          </Grid>

          <Grid
            item
            xs={1}
            md={1}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography
              variant="body1"
              sx={{
                textWrap: 'wrap',
                lineBreak: 'anywhere',
                whiteSpace: 'break-spaces',
              }}
            >
              {appointment.status}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ marginTop: '40px' }}>
        <Box sx={{ marginBottom: '25px' }}>
          <Box sx={{ width: '350px', ml: '30px' }}>
            <Card
              onClick={handleClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '100px',
                padding: '16px',
                borderRadius: '20px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer', // Optional: changes cursor to pointer on hover
              
              }}
            >
              <Avatar sx={{ background: '#F4F7FE', width: 56, height: 56 }}>
                <MedicalInformationOutlinedIcon
                  sx={{
                    width: 36,
                    height: 36,
                    color: 'black',
                  }}
                />
              </Avatar>
              <Typography
                sx={{
                  color: '#0B4FA6',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  ml: '40px',
                }}
              >
                Medical History
              </Typography>
            </Card>
          </Box>
        </Box>
        <Box sx={{ width: '350px', ml: '30px' }}>
          <Card
            onClick={handleStartDiagnosisClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100px',
              padding: '16px',
              borderRadius: '20px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer', // Added cursor pointer here as well
            }}
          >
            <Avatar sx={{ background: '#F4F7FE', width: 56, height: 56 }}>
              <MonitorHeartOutlinedIcon
                sx={{
                  width: 36,
                  height: 36,
                  color: 'black',
                }}
              />
            </Avatar>
            <Typography
              sx={{
                color: '#139C94',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 'bold',
                fontSize: '20px',
                ml: '40px',
              }}
            >
              Start Diagnosis
            </Typography>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewAppointmentDetail;
