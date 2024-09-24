import styles from './dashboard-appointments.module.scss';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import HospitalContext from '../../contexts/hospital-context';
import { UserDetailsDto } from '@healthcare/data-transfer-types';
import DoctorContext from '../../contexts/doctor-context';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import doctorContext from '../../contexts/doctor-context';
import { Link } from 'react-router-dom';

/* eslint-disable-next-line */
export interface DashboardAppointmentsProps {}

export interface ViewAppointment {
  id: number;
  appointmentDate: string;
  status: { id: number; code: string; name: string };
  patient: PatientDetailsDto;
  doctor: DoctorDetailsDto;
  viewAppointment: boolean;
  declineAppointment: boolean;
  declinedAppointment: boolean;
  acceptAppointment: boolean;
  appointment: boolean;
}

interface PatientDetailsDto {
  user: UserDetailsDto;
}
interface DoctorDetailsDto {
  user: UserDetailsDto;
}

export function DashboardAppointments(props: DashboardAppointmentsProps) {
  const [appointmentsData, setAppointmentsData] = useState<ViewAppointment[]>(
    []
  );
  const appointments = [];
  const apiUrl = environment.apiUrl;
  const hospitalcontext = useContext(HospitalContext);
  const doctorcontext = useContext(DoctorContext);

  const [selectedComponent, setSelectedComponent] = useState('dashboard');
  const handleComponentChange = (componentName: any) => {
    setSelectedComponent(componentName);
  };

  const doctorContext = useContext(DoctorContext);

  const getAllAppointments = useCallback(async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/appointments`,
        {
          withCredentials: true,
        }
      );
      // console.log(response.data[0].user)
      const { content, total } = response.data;
      setAppointmentsData(response.data.content);
      console.log('App Data', response.data.content);
    } catch (error) {
      console.error('Error fetching hospital data:', error);
    }
  }, [apiUrl, hospitalcontext?.hospital?.id]);

  useEffect(() => {
    getAllAppointments();
  }, [apiUrl, hospitalcontext?.hospital?.id, getAllAppointments]);

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString();
  };

  return (
    <Box
      sx={{
        maxWidth: '100px',
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
        //  borderRadius: "8px",
        //  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
      }}
    >
      {/* Header */}
      {/* <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Link href="#" underline="none" color="#064B4F" fontSize="0.875rem" 
        sx={{
          textDecoration: "underline",
        }}
        >
          view all
        </Link>
      </Box> */}

      {/* Timeline Container */}
      <Card
        sx={{
          position: 'absolute',
          height: '430px',
        }}
      >
         <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 2,
        ml: 2,
        mr: 2, // margin-right to give some space on the right side
      }}
    >
      {/* Header */}
      <Typography variant="h5" fontWeight="bold" color="#064B4F" marginBottom={1}>
        Upcoming Appointments
      </Typography>

      {/* View All Link */}
      <Link
        style={{ textDecoration: 'none', color: '#064B4F', }}
        to={`/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorContext?.doctor?.id}/appointments`}
        onClick={() => handleComponentChange('appointments')}
      >
        <Typography variant="body2" sx={{ textDecoration: 'underline', marginRight: '15px' }}>
          View All
        </Typography>
      </Link>
    </Box>


        <Box sx={{ position: 'relative' }}>
          {/* {appointmentsData.map((appointment, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 3,color:'#064B4F' }}>
            Time Section
            <Box sx={{ width: "25%", textAlign: "center" }}>
              <Typography variant="body1" sx={{ fontWeight: "bold"}}>
                {formatDate(appointment.appointmentDate)}
              </Typography>
            </Box>

            Line and Dot Section
            <Box sx={{ width: "10%", position: "relative", display: "flex", justifyContent: "center" }}>
              Vertical Line
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  bottom: 0,
                  width: "2px",
                  top: -40,
                  height: "130px",
                  backgroundColor: "#064B4F",
                }}
              />
              Dot
              <Box
                sx={{
                  position: "relative",
                  top: "0px",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#064B4F",
                  borderRadius: "50%",
                  zIndex: 1,
                }}
              />
            </Box>

            Appointment Info Section
            <Box sx={{ width: "100%" }}>
              <Card sx={{ display: "flex", alignItems: "center", boxShadow: 2, borderRadius: "8px", padding: "8px" }}>
                <Avatar sx={{ bgcolor: blue[500], width: 40, height: 40, mr: 2 }} src="https://via.placeholder.com/40" />
                <CardContent sx={{ padding: "0px" }}>
                  <Typography variant="body1" fontWeight="bold">
                    {appointment.doctor.user.firstName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {appointment?.status.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {appointment.doctor?.user.email}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        ))} */}

          {/* <Typography variant="h4" sx={{textAlign:'center'}}>Appointment Schedule</Typography> */}
          <Timeline
            sx={{
              position: 'relative',
              padding: '6px 0px',
              marginRight: '14px',
              marginTop: '-3px'
            }}
          >
            {appointmentsData ? (
              appointmentsData.slice(-2).map((appointment, index) => (
                <TimelineItem key={appointment.id} position="right">
                  <TimelineSeparator>
                    <TimelineDot sx={{ backgroundColor: '#064B4F' }} />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography color="textSecondary" sx={{ marginBottom: 1 }}>
                      {formatDate(appointment.appointmentDate)}
                    </Typography>
                    <Card sx={{ marginBottom: 1, width: '20vw' }}>
                      <CardContent sx={{ padding: '10px' }}>
                        <Typography variant="h5" color="#000000">
                          {appointment.patient.user.firstName}
                          {' '}
                          {appointment.patient.user.lastName}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: '#454C73', marginBottom: 1 }}
                        >
                          {appointment?.status.name}
                        </Typography>
                        <Divider
                          sx={{ marginY: 1, backgroundColor: '#F4F6FA' }}
                        />
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography variant="body2">
                            {appointment.patient.user.email}
                          </Typography>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography variant="body2">
                            {appointment.patient.user.phoneNumber}
                          </Typography>
                        </div>
                      </CardContent>
                    </Card>
                  </TimelineContent>
                </TimelineItem>
              ))
            ) : (
              // Render a placeholder item if no diagnoses exist
              <TimelineItem position="right">
                <TimelineSeparator>
                  <TimelineDot sx={{ backgroundColor: '#064B4F' }} />{' '}
                  {/* Optional: Different color for 'No Data' */}
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Card sx={{ marginBottom: 2 }}>
                    <CardContent>
                      <Typography variant="h6" color="textSecondary">
                        No Data Available
                      </Typography>
                    </CardContent>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            )}
          </Timeline>
        </Box>
      </Card>
    </Box>
  );
}

export default DashboardAppointments;
