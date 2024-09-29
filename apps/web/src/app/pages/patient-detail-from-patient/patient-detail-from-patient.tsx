import React, { useContext, useEffect, useState } from 'react';
import { Box, Card, Typography, Avatar, Button, Divider } from '@mui/material';
import styles from './patient-detail-from-patient.module.scss';
import ViewMedicalHistoryTimeline from '../../view-medical-history-timeline/view-medical-history-timeline';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import HospitalContext from '../../contexts/hospital-context';
import DoctorContext from '../../contexts/doctor-context';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Patient,
  ViewAllUser,
  ViewAppointment,
} from '@healthcare/data-transfer-types';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined';
// import AddAppointment from '../hospital-add-appointment/hospital-add-appointment';
import AddAppointment from '../hospital-list-appointment/hospital-add-appointment/hospital-add-appointment';
import { enqueueSnackbar } from 'notistack';
import StatusChip from '../../Components/chip/statusChip';
import AppointmentContext from '../../contexts/appointment-context';
import { format, formatDate } from 'date-fns';
import { Margin } from '@mui/icons-material';
import doctorContext from '../../contexts/doctor-context';
/* eslint-disable-next-line */

interface Form {
  doctor: ViewAllUser | null;
  appointmentDate: Date;
  statusId: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PatientDetailFromPatientProps {}

// interface Patient {
//   id: number;
//   patientid: string;
//   name: string;
//   appointments: number;
//   completed: number;
//   weight: number;
//   height: number;
//   bloodpressure: string;
//   disease: string;
// }

export function PatientDetailFromPatient(props: PatientDetailFromPatientProps) {
  const apiUrl = environment.apiUrl;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const doctorContext = useContext(DoctorContext);
  const [appointment, setAppointment] = useState<ViewAppointment>();
  const [appointmentCount, setAppointmentCount] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    cancelled: 0,
    confirmed: 0,
  });
  const address = `${patient?.addressLine1},${patient?.addressLine2 || ''},${
    patient?.city
  },${patient?.stateCode},${patient?.countryCode},${patient?.postalCode}`;
  // const patients: Patient[] = [
  //   {
  //     id: 1,
  //     patientid: '12345',
  //     name: 'John Doe',
  //     appointments: 5,
  //     completed: 3,
  //     weight: 70,
  //     height: 182,
  //     bloodpressure: '120/80',
  //     disease: 'Diabetes',
  //   },

  // ];

  const params = useParams();
  console.log('params:', params);

  const hospitalcontext = useContext(HospitalContext);
  const doctorcontext = useContext(DoctorContext);
  const appointmentcontext = useContext(AppointmentContext);

  console.log('appointmentcontext:', appointmentcontext);

  useEffect(() => {
    getCounts();
  }, []);

  const getAppointment = async () => {
    const response = await axios.get(
      `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patients/${params.patientId}/appointments/{id}`,
      {
        withCredentials: true,
      }
    );
    setAppointment(response.data);
  };

  const getpatientinfo = async () => {
    try {
      setLoadingUserInfo(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(
        `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patient/${params.patientId}`,
        {
          withCredentials: true,
        }
      );
      setPatient(response.data);
      console.log('Patient Detail:', response.data);
      console.log('Patient Detail:', response.data.isPrimary);
      setLoadingUserInfo(false);
    } catch (error) {
      console.log('Error in fetching Patient details', error);
      setLoadingUserInfo(false);
    }
  };

  useEffect(() => {
    getpatientinfo();
  }, [params]);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(
      `/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patients/${params.patientId}/medical-history`
    );
  };

  const handleStartDiagnosisClick = () => {
    navigate(
      `/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/appointments`
    );
  };

  const getCounts = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/hospitals/${params.hospitalId}/appointment-count`,
        { withCredentials: true }
      );

      setAppointmentCount(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddAppointment = async (formData: Form) => {
    try {
      await setIsAddModalOpen(false);

      const { data: responseData } = await axios.post(
        `${apiUrl}/hospitals/${params.hospitalId}/doctors/${formData?.doctor?.id}/patients/${patient?.id}/appointments`,
        {
          appointmentDate: formData.appointmentDate,
          statusId: formData.statusId,
        },
        {
          withCredentials: true,
        }
      );
      if (responseData) {
        enqueueSnackbar('Appointment added successfully', {
          variant: 'success',
        });
        setIsAddModalOpen(false);
      } else {
        console.log('Something went wrong');
      }
      console.log('Appointment added successfully', responseData);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong in input form');
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  const formatDate = (isoDateString: string) => {
    return new Date(isoDateString).toLocaleDateString(); // Convert ISO string to local date format
  };

  return (
    <Box className={styles['container']}>
      {/* Page Header */}
      <Typography
        variant="h2"
        sx={{
          fontWeight: 'bold',
          marginLeft: 5,
          marginTop: 3,
          color: '#064B4F',
          textAlign: 'left',
        }}
      >
        Patient Details
      </Typography>
      {/* {patients && patients.map((patient) => ( */}
      <Box sx={{ display: 'flex' }}>
        <Box
          key={patient?.id}
          sx={{
            marginBottom: 2,
            marginTop: 2,
            width: '48%',
            height: '100%',
            marginRight: '1%',
          }}
        >
          <Card
            sx={{
              padding: 1.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'left',
              height: '50%',
              borderRadius: '10px',
              marginLeft: '30px',
            }}
          >
            {/* Avatar with initials */}
            <div
              style={{
                display: 'flex',
                gap: '15px',
              }}
            >
              <div>
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                    fontSize: 24,
                    bgcolor: '#064B4F',
                    marginBottom: '10px',
                  }}
                >
                  {`${patient?.firstName[0] || ''}${
                    patient?.lastName?.[0] || ''
                  }`}
                </Avatar>
              </div>
              {/* Patient ID */}
              <div
                style={{
                  marginTop: '2px',
                }}
              >
                <Typography variant="h4">
                  {patient?.firstName} {patient?.lastName}
                </Typography>
                <Typography variant="h5" sx={{ marginTop: 1, marginBottom: 2 }}>
                  Digital Health Code : {patient?.digitalHealthCode}
                </Typography>
                <div
                  style={{
                    marginBottom: '40px',
                  }}
                >
                  {patient?.isActive ? (
                    <StatusChip
                      label={'Success'}
                      children={'Active'}
                      width={'80px'}
                    ></StatusChip>
                  ) : (
                    <StatusChip
                      label={'Success'}
                      children={'InActive'}
                      width={'80px'}
                    ></StatusChip>
                  )}
                </div>
              </div>
            </div>

            {/* Appointment and Completed status */}
            {/* <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  width: '100%',
                  marginTop: 3,
                  alignItems: 'center', // Center-aligns content vertically
                }}
              >
                <Box>
                  <Typography variant="h1" sx={{ marginLeft: 5, marginBottom: 2 }}>
                    {appointmentCount.total}
                  </Typography>
                  <Typography variant="h4" color="textPrimary" sx={{ color: '#000000' }}>
                    Appointments
                  </Typography>
                </Box>
                Vertical Divider
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    backgroundColor: '#DFE8F6',
                    width: '2px', // Makes the divider thicker
                    margin: '0 20px', // Adds horizontal space around the divider
                  }}
                />
                <Box>
                  <Typography variant="h1" sx={{ marginLeft: 4, marginBottom: 2 }}>
                    {appointmentCount.confirmed}
                  </Typography>
                  <Typography variant="h4" color="textPrimary" sx={{ color: '#000000' }}>
                    Completed
                  </Typography>
                </Box>
              </Box> */}
            {/* Button */}
            {/* <Box sx={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'96%'}}> */}
            {/* <Button
                variant="contained"
                sx={{
                  marginTop: 2,
                  fontFamily: 'Poppins, sans-serif', // Use Poppins font
                  backgroundColor: '#064B4F',
                  padding: '25px 80px', // Increase padding for larger button
                  fontSize: '12px', // Increase font size
                  width: '200px', // Optional: adjust width if needed
                  textWrap:'nowrap',
                }}
                onClick={() => setIsAddModalOpen(true)}
              // Optionally add hover effect or other button styles
              >
                Book Appointment
              </Button> */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                rowGap: 2,
                columnGap: 1,
                marginTop: 1,
                marginLeft: 11,
              }}
            >
              {[
                { label: 'Number', value: `${patient?.phoneNumber}` },
                { label: 'Email', value: `${patient?.email}` },
                {
                  label: 'Date of Birth',
                  value: patient?.dob && formatDate(patient?.dob),
                },
                { label: 'Address', value: address },
              ].map((item) => (
                <React.Fragment key={item.label}>
                  {/* Label on the left */}
                  <Typography variant="h5" style={{ color: '#000000' }}>
                    {item.label}:
                  </Typography>
                  {/* Value on the right */}
                  <Typography
                    variant="h5"
                    style={{
                      color: '#064B4F',
                      textAlign: 'left',
                      marginRight: '30px',
                    }} // Left aligned
                  >
                    {item.value}
                  </Typography>
                </React.Fragment>
              ))}
            </Box>

            <AddAppointment
              open={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSubmit={handleAddAppointment}
            />
            <Button
              variant="contained"
              sx={{
                marginTop: 2,
                marginBottom: 2,
                marginLeft: 21,
                fontFamily: 'Inter, sans-serif',
                padding: '25px 80px',
                fontSize: '16px',
                width: '200px',
                textWrap: 'nowrap',
              }}
              onClick={handleStartDiagnosisClick}
            >
              Book Appointment
            </Button>
            {/* </Box> */}
          </Card>

          <Card
            style={{
              padding: 1.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'left',
              height: '50%',
              borderRadius: '10px',
              marginLeft: '30px',
              marginTop: '2%',
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: '#064B4F',
                marginBottom: 3,
                marginTop: 2,
                marginLeft: 3,
              }}
            >
              Patient Information
            </Typography>

            {/* Patient Details */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                columnGap: 10,
                rowGap: 3,
                marginTop: '3%',
                marginLeft: '11%',
                marginBottom: '3%',
                width: '48%',
              }}
            >
              {[
                { label: 'Weight', value: `${patient?.age} kg` },
                { label: 'Blood Group', value: `${patient?.bloodGroup}` },
                { label: 'Disease', value: patient?.acuteDisease },
                { label: 'Age', value: patient?.age },
                { label: 'Gender', value: patient?.gender },
                { label: 'Chronic Diseases', value: patient?.chronicDisease },
              ].map((item) => (
                <React.Fragment key={item.label}>
                  <Typography
                    variant="h5"
                    sx={{ color: '#000000', textAlign: 'left' }}
                  >
                    {item.label}:
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ color: '#064B4F', textAlign: 'left' }} // Align value to the right
                  >
                    {item.value}
                  </Typography>
                </React.Fragment>
              ))}
            </Box>
          </Card>
        </Box>

        <Box
          style={{
            width: '48%',
            height: '100%',
            marginRight: '1%',
            marginLeft: '1%',
          }}
        >
          <ViewMedicalHistoryTimeline
            patient={patient}
          ></ViewMedicalHistoryTimeline>
        </Box>
      </Box>

      {/* ))} */}
    </Box>
  );
}

export default PatientDetailFromPatient;
