import React, { useContext, useEffect, useState } from 'react';
import { Box, Card, Typography, Avatar, Button, Divider } from '@mui/material';
import styles from './patient-detail.module.scss';
import ViewMedicalHistoryTimeline from '../../view-medical-history-timeline/view-medical-history-timeline';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import HospitalContext from '../../contexts/hospital-context';
import DoctorContext from '../../contexts/doctor-context';
import { useParams } from 'react-router-dom';
import { Patient } from '@healthcare/data-transfer-types';
/* eslint-disable-next-line */
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


  const getpatientinfo = async () => {

    try {
      setLoadingUserInfo(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(`${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patient/${params.patientId}`, {
        withCredentials: true,
      });
      setPatient(response.data);
      console.log("PAtient Detail:", response.data);
      console.log("PAtient Detail:", response.data.isPrimary);
      setLoadingUserInfo(false);
    } catch (error) {
      console.log("Error in fetching device details", error);
      setLoadingUserInfo(false);
    }

  }

  useEffect(() => {
    getpatientinfo();
  }, [patient]);
  return (
    <div className={styles['container']}>
      {/* {patients && patients.map((patient) => ( */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Box key={patient?.id} sx={{ marginBottom: 2, marginTop: 5, marginLeft: 5 }}>
            <Card
              sx={{
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                marginLeft: '2%',
                height: 'auto', // Changed to auto to fit content
                borderRadius: '10px',
              }}
            >
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
              {/* Appointment and Completed status */}
              <Box
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
                    {patient?.acuteDisease}
                  </Typography>
                  <Typography variant="h4" color="textPrimary" sx={{ color: '#000000' }}>
                    Appointments
                  </Typography>
                </Box>
                {/* Vertical Divider */}
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
                    {patient?.isActive}
                  </Typography>
                  <Typography variant="h4" color="textPrimary" sx={{ color: '#000000' }}>
                    Completed
                  </Typography>
                </Box>
              </Box>
              {/* Button */}
              <Button
                variant="contained"
                sx={{
                  marginTop: 2,
                  fontFamily: 'Poppins, sans-serif', // Use Poppins font
                  backgroundColor: '#064B4F',
                  padding: '25px 80px', // Increase padding for larger button
                  fontSize: '18px', // Increase font size
                  width: 'fit-content', // Optional: adjust width if needed
                }}
              // Optionally add hover effect or other button styles
              >
                Book Appointment
              </Button>
            </Card>
            {/* Patient Information Card */}
            <Card
              sx={{
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                marginLeft: '2%',
                height: 'auto', // Changed to auto to fit content
                borderRadius: '10px',
                marginTop: 3, // Added marginTop for spacing
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
          <Box>
          <ViewMedicalHistoryTimeline ></ViewMedicalHistoryTimeline>
          </Box>

        </Box>

      {/* ))} */}

    </div>
  );
}

export default PatientDetail;
