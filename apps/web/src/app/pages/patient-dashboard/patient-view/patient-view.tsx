import React, { useContext, useEffect, useState } from 'react';
import { Box, Card, Typography, Avatar, Button, Divider } from '@mui/material';
import styles from './patient-view.module.scss';
import ViewMedicalHistoryTimeline from '../../../view-medical-history-timeline/view-medical-history-timeline';
import axios from 'axios';
import { environment } from '../../../../environments/environment';
import HospitalContext from '../../../contexts/hospital-context';
import DoctorContext from '../../../contexts/doctor-context';
import { useNavigate, useParams } from 'react-router-dom';
import { Patient, ViewAllUser, ViewAppointment } from '@healthcare/data-transfer-types';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined';
import AddAppointment from './hospital-add-appointment/hospital-add-appointment';
import { enqueueSnackbar } from 'notistack';
import StatusChip from '../../../Components/chip/statusChip';
import AppointmentContext from '../../../contexts/appointment-context';
import { format, formatDate } from 'date-fns';
import PatientContext from '../../../contexts/patient-context';
/* eslint-disable-next-line */

interface Form {
  doctor: ViewAllUser | null;
  appointmentDate: Date;
  statusId: number;
}

export interface PatientDetailProps { }

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

export function PatientDetail(props: PatientDetailProps) {
  const apiUrl = environment.apiUrl;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [appointment,setAppointment]=useState<ViewAppointment>();
  const [appointmentCount, setAppointmentCount] = useState({ total:0,pending: 0, inProgress: 0, cancelled: 0, confirmed: 0 });
  const address=`${patient?.addressLine1},${(patient?.addressLine2 || '')},${patient?.city},${patient?.stateCode},${patient?.countryCode},${patient?.postalCode}`;
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



  const params=useParams();
  console.log("params:",params);

  const hospitalcontext=useContext(HospitalContext);
  const doctorcontext=useContext(DoctorContext);
  const appointmentcontext=useContext(AppointmentContext);
  const patientcontext=useContext(PatientContext);

  console.log("appointmentcontext:",appointmentcontext);

  useEffect(() => {
    getCounts();
  }, []);


  const getAppointment=async()=>{
    const response=await axios.get(`${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patients/${params.patientId}/appointments/{id}`, {
      withCredentials: true,
    });
    setAppointment(response.data);
  }

  const getpatientinfo = async () => {

    try {
      setLoadingUserInfo(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(`${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/patients/${patientcontext?.patient?.id}`, {
        withCredentials: true,
      });
      setPatient(response.data[0]);
      console.log("PAtient Detail:", response.data[0]);
      console.log("PAtient Detail:", response.data.isPrimary);
      setLoadingUserInfo(false);
    } catch (error) {
      console.log("Error in fetching device details", error);
      setLoadingUserInfo(false);
    }

  }

  useEffect(() => {
    getpatientinfo();
  }, [params,patientcontext?.patient?.id]);

  const navigate=useNavigate();

  const handleClick = () => {
    navigate(`/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patients/${params.patientId}/medical-history`);
  };

  const handleStartDiagnosisClick = () => {

    navigate(`/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patients/${params.patientId}/diagnosis`);
  };

  const getCounts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/hospitals/${params.hospitalId}/appointment-count`, { withCredentials: true });

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
        enqueueSnackbar('Appointment added successfully', { variant: 'success' });
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
    <div className={styles['container']}>
      {/* {patients && patients.map((patient) => ( */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around', width:'80vw' }}>
        {/* <Box sx={{ marginTop: '40px' }}>
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
      </Box> */}
          <Box key={patient?.id} sx={{ marginBottom: 2, marginTop: 1, marginLeft: -2, width:'40%' }}>
            <Card
              sx={{
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                marginLeft: '2%',
                height: 'auto', // Changed to auto to fit content
                borderRadius: '10px',
                // border:'none',
                // boxShadow:'none'
              }}
            >
              <div style={{position:'relative', right:'-44%'}}>
                {patient?.isActive ? <StatusChip label={'Success'} children={'Active'} width={'80px'}></StatusChip> :
                   <StatusChip label={'Success'} children={'InActive'} width={'80px'}></StatusChip>
                }
              </div>
              {/* Avatar with initials */}
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: 24,
                  bgcolor: '#064B4F',
                  marginTop: '10px',
                }}
              >
              {patient?.firstName.split(' ').map((name) => name[0]).join('')}
              </Avatar>
              {/* Patient ID */}
              <Typography variant="h3" sx={{ marginTop: 3 }}>
                Patient Id : #{patient?.digitalHealthCode}
              </Typography>
              <Typography variant="h3" sx={{ marginTop: 3 }}>
                 {appointmentcontext?.appointment?.status.name}
              </Typography>
              <Typography variant="h3" sx={{ marginTop: 3 }}>
                 {patient?.firstName}{patient?.lastName}
              </Typography>
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
                  display: 'flex',
                  flexDirection: 'column', // Main axis is vertical
                  width: '100%',
                  padding: '5px 16px', // Horizontal padding for content
                }}
              >
                {[
                  { label: 'Number', value: `${patient?.phoneNumber}` },
                  { label: 'Email', value: `${patient?.email}` },
                  // { label: 'Blood Pressure', value: patient.bloodpressure },
                  { label: 'Date of Birth', value:patient?.dob  && formatDate(patient?.dob)},
                  { label: 'Address', value:address},
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: 'flex', // Layout is horizontal
                      justifyContent: 'space-between', // Space between label and value
                      alignItems: 'center', // Center align items vertically
                      marginBottom: 1, // Space between rows
                    }}
                  >
                    <Typography variant="h5" sx={{ color: '#000000' }}>
                      {item.label}:
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#064B4F' }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <AddAppointment
              open={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSubmit={handleAddAppointment}
              />
              {/* <Button
                variant="outlined"
                sx={{
                  marginTop: 2,
                  fontFamily: 'Poppins, sans-serif', // Use Poppins font
                  // backgroundColor: '#064B4F',
                  padding: '25px 80px', // Increase padding for larger button
                  fontSize: '12px', // Increase font size
                  width: '200px', // Optional: adjust width if needed
                  textWrap:'nowrap'
                }}
                onClick={handleStartDiagnosisClick}
              // Optionally add hover effect or other button styles
              >
                Start Diagnosis
              </Button> */}
            {/* </Box> */}
            </Card>
            {/* Patient Information Card */}
            <Card
              sx={{
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                marginLeft: '2%',
                height: '30vh', // Changed to auto to fit content
                borderRadius: '10px',
                marginTop: 2, // Added marginTop for spacing
              }}
            >
              <Typography variant="h2" sx={{ color: '#064B4F', marginBottom: 2 }}>
                Patient Information
              </Typography>

              {/* Patient Details */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column', // Main axis is vertical
                  width: '100%',
                  padding: '5px 16px', // Horizontal padding for content
                }}
              >
                {[
                  { label: 'Weight', value: `${patient?.age} kg` },
                  // { label: 'Height', value: `${patient.height} cm` },
                  { label: 'Blood Group', value: `${patient?.bloodGroup}` },
                  // { label: 'Blood Pressure', value: patient.bloodpressure },
                  { label: 'Disease', value: patient?.acuteDisease},
                  { label: 'Age', value: patient?.age},
                  { label: 'Gender', value: patient?.gender},
                  {label:'Chronic Diseases',value:patient?.chronicDisease}
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: 'flex', // Layout is horizontal
                      justifyContent: 'space-between', // Space between label and value
                      alignItems: 'center', // Center align items vertically
                      marginBottom: 1, // Space between rows
                    }}
                  >
                    <Typography variant="h5" sx={{ color: '#000000' }}>
                      {item.label}:
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#064B4F' }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>
          <Box sx={{width:'50%'}}>
          <ViewMedicalHistoryTimeline patient={patient} ></ViewMedicalHistoryTimeline>
          </Box>

        </Box>

      {/* ))} */}

    </div>
  );
}

export default PatientDetail;
