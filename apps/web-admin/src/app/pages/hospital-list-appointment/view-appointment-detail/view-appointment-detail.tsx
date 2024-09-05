// view-appointment-detail.tsx
import React, { useCallback, useEffect, useState } from 'react';
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
import { StatusEnum } from '../hospital-list-appointment';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined';
import { environment } from '../../../../environments/environment';
import axios from 'axios';
import { format } from 'date-fns';

export interface ViewAppointment {
  id: number;
  appointmentDate: string;
  status: { id: number; code: string; name: string };
  patient: PatientDetailsDto;
  doctor: DoctorDetailsDto;
}

interface PatientDetailsDto {
  user: UserDetailsDto;
}
interface DoctorDetailsDto {
  user: UserDetailsDto;
}

// DTO for detailed user information (part of PatientDetails)
interface UserDetailsDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}


const ViewAppointmentDetail: React.FC = () => {
  const apiUrl = environment.apiUrl;
  const params = useParams();
  const [appointment, setAppointment] = useState<ViewAppointment | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchQueryName, setSearchQueryName] = useState<string>('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [appointmentsData, setAppointmentsData] = useState<ViewAppointment>();
 

  const getAllAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/hospitals/${params.hospitalId}/doctors/${params.doctorId}/patients/${params.patientId}/appointments/${params.appointmentId}`,
        {
          withCredentials: true,
          params: {
            pageSize: rowsPerPage,
            pageOffset: page -1,
            // appointmentDate: searchQueryName,
          },
        }
      );
      // console.log(response.data[0].user)
      const { content, total } = response.data;
      setAppointmentsData(response.data);
      // setTotalItems(total);
      console.log('Admin Data', response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      setLoading(false);
    }
  }, [apiUrl, page, params.appointmentId, params.doctorId, params.hospitalId, params.patientId, rowsPerPage]);

  useEffect(() => {
    getAllAppointments();
  }, [apiUrl, page, params.hospitalId, rowsPerPage, getAllAppointments]);


  // if (loading) return <div>Loading...</div>;

  // if (!appointment) {
  //   return <div>Appointment not found</div>;
  // }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const handleClick = () => {
    navigate('/medical-history');
  };

  const handleStartDiagnosisClick = () => {
    navigate('/diagnosis');
  };

   // Helper function to format date
   const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MM/dd/yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
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
          {/* <Avatar
            sx={{
              bgcolor: '#4FD1C5',
              width: 60,
              height: 60,
              fontSize: '24px',
              mr: 2,
            }}
          >
            {getInitials(appointmentsData?.patient?.user?.firstName, appointmentsData.lastName)}
          </Avatar> */}
          <Typography
            variant="h5"
            sx={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 'bold' }}
          >
            {`${appointmentsData?.patient?.user?.firstName} ${appointmentsData?.patient?.user?.lastName}`}
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
          {/* <Grid
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
              {appointmentsData?.patient?.user?.email}
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
              {appointmentsData?.patient?.user?.phoneNumber}
            </Typography>
          </Grid> */}

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
              {appointmentsData?.patient?.user?.email}
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
              {appointmentsData?.patient?.user?.phoneNumber}
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
            {formatDate(appointmentsData?.appointmentDate)}
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
              {appointmentsData?.status?.name}
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
