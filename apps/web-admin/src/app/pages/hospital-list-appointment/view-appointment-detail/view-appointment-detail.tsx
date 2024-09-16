// view-appointment-detail.tsx
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Avatar,
  Divider,
  Card,
  Grid,
  Stack,
} from '@mui/material';
import styles from './view-appointment-detail.module.scss';
import { AcuteDisease, ChronicDisease, Gender } from '@prisma/client';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined';
import { environment } from '../../../../environments/environment';
import axios from 'axios';
import { format } from 'date-fns';
import { HospitalContext } from '../../../contexts/user-contexts';
import { stringAvatar } from '../../../utils/user';

export interface ViewAppointment {
  id: number;
  appointmentDate: string;
  status: { id: number; code: string; name: string };
  patientId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  gender: Gender;
  age: number;
  bloodGroup: string;
  dob: string;
  digitalHealthCode: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  chronicDiseases?: ChronicDisease[];
  acuteDiseases?: AcuteDisease[];
  isActive: boolean;
}

// interface PatientDetailsDto {
//   user: UserDetailsDto;
// }
// interface DoctorDetailsDto {
//   user: UserDetailsDto;
// }

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
  const hospitalContext = useContext(HospitalContext);
  const [appointment, setAppointment] = useState<ViewAppointment | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchQueryName, setSearchQueryName] = useState<string>('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [appointmentsData, setAppointmentsData] =
    useState<ViewAppointment | null>(null);

  const getAllAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/hospitals/${params.hospitalId}/doctors/${params.doctorId}/patients/${params.patientId}/appointments/${params.appointmentId}`,
        {
          withCredentials: true,
          params: {
            pageSize: rowsPerPage,
            pageOffset: page - 1,
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
  }, [
    apiUrl,
    page,
    params.appointmentId,
    params.doctorId,
    params.hospitalId,
    params.patientId,
    rowsPerPage,
  ]);

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
    navigate(`/hospitals/${hospitalContext?.id}/doctors/${params.doctorId}/patients/${params.patientId}/appointments/${params.appointmentId}/medical-history`);
  };

  const handleStartDiagnosisClick = () => {
    navigate(`/hospitals/${hospitalContext?.id}/doctors/${params.doctorId}/patients/${params.patientId}/appointments/${params.appointmentId}/diagnosis`);
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
              <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          {...stringAvatar(
                            `${appointmentsData?.firstName} ${appointmentsData?.lastName}`,
                            'small'
                          )}
                        />
                        <Box>
                          <Typography variant="body1"   className={styles['socname']}>
                            <b>
            {`${appointmentsData?.firstName} ${appointmentsData?.lastName}`}
            </b>
                          </Typography>
                        </Box>
                      </Stack>
                       
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
              {appointmentsData?.email}
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
              {appointmentsData?.phoneNumber}
            </Typography>
          </Grid>
          <Grid
            item
            xs={1}
            md={1}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography variant="subtitle1" sx={{ mr: '20px' }}>
              Appointment Date:
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
               {appointmentsData?.status?.name
    ? appointmentsData.status.name.charAt(0).toUpperCase() + appointmentsData.status.name.slice(1).toLowerCase()
    : ''}
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
              {appointmentsData?.gender
    ? appointmentsData.gender.charAt(0).toUpperCase() + appointmentsData.gender.slice(1).toLowerCase()
    : ''}
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
              {appointmentsData?.age}
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
            Blood Group:
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
              {appointmentsData?.bloodGroup}
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
            Date of birth:
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
              {formatDate(appointmentsData?.dob)}
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
            DigitalHealthCode:
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
              {appointmentsData?.digitalHealthCode}
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
            Address Line:
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
              {appointmentsData?.addressLine1} {appointmentsData?.addressLine2}, {appointmentsData?.city}, {appointmentsData?.postalCode}
            </Typography>
          </Grid>
        </Grid>
        {/* <Grid
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
            City:
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
              {appointmentsData?.city}
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
            State Code:
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
              {appointmentsData?.stateCode}
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
            Country Code:
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
              {appointmentsData?.countryCode}
            </Typography>
          </Grid>
        </Grid> */}
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
            Postal Code:
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
              {appointmentsData?.postalCode}
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
            Chronic Diseases:
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
              {appointmentsData?.chronicDiseases?.map(disease => disease.charAt(0).toUpperCase() + disease.slice(1).toLowerCase())
    .join(', ')}
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
            Acute Diseases:
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
              {appointmentsData?.acuteDiseases?.map(disease => disease.charAt(0).toUpperCase() + disease.slice(1).toLowerCase())
    .join(', ')}
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
