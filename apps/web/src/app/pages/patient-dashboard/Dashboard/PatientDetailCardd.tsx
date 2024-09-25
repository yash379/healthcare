import React, { useContext, useEffect, useState } from 'react';
import { Box, Card, Typography, Button, Divider } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { environment } from '../../../../environments/environment';
import PatientContext from '../../../contexts/patient-context';

interface Patient {
  id: number;
  patientid: string;
  name: string;
  appointments: number;
  completed: number;
  weight: number;
  height: number;
  bloodpressure: string;
  disease: string;
  gender: string;
  age: number;
}

interface Diagnosis {
  id: number;
  details: string;
  height: number;
  weight: number;
  pulse: number;
  spo2: number;
  temperature: number;
  chiefComplaints: string[];
  doctorId: number;
  patientId: number;
  diagnosisDate: string;
  createdAt: string;
  updatedAt: string;
  medicalHistoryId: number;
}

export interface PatientDetailCarddProps {
  patientId:number | undefined;
}



function PatientDetailCardd({patientId}:PatientDetailCarddProps) {

  const [patient, setPatient]=useState<Patient | null>(null);
  const [detail,setDetail]=useState<Diagnosis | null>(null);
  const apiUrl = environment.apiUrl;
  const params=useParams();
  const patientcontext=useContext(PatientContext);

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
  //     gender: 'Male',
  //     age: 24,
  //   },
  // ];

  const getDiagnosis=async()=>{
    const response = await axios.get(`${apiUrl}/diagnoses/${patientId}`,
      {
        withCredentials:true
      }
    );

    setDetail(response.data);

    console.log("Patient diagnosis:", response.data);
  }

  const getPatient=async()=>{
    const response = await axios.get(`${apiUrl}/hospitals/${params.hospitalId}/patients/${patientId}`,
      {
        withCredentials:true
      }
    );

    setPatient(response.data[0]);

    console.log("Patient history:", response.data);
  }

  useEffect(()=>{
    getPatient();
    getDiagnosis();
  },[params.patientId,params.hospitalId, params.doctorId,patientcontext?.patient?.id ]);

  return (
    <div style={{width:'50%'}}>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }} key={patient?.id}>
            <Box>
              <Card
                sx={{
                  padding: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '10px',
                  width: '100%',
                  height: '40vh',
                  marginLeft:'-64px',
                  paddingInline: '50px',
                  marginTop: '-20px',
                  paddingTop: '38px',
                }}
              >
                <Typography variant="h4"
                 sx={{
                   color: '#064B4F',
                  marginBottom: 2 ,
                  fontSize: '20px',
                }}>
                  Vitals
                </Typography>

                {/* Patient Details */}
                <Box sx={{ display: 'flex', 
                flexDirection: 'column', 
                width: '100%' 
                ,
                // ,padding:"0px 0px 0px 10px",
                }}>
                  {[
                    { label: 'Weight', value: `${detail?.weight} kg` },
                    { label: 'Height', value: `${detail?.height} cm` },
                    { label: 'Gender', value: patient?.gender },
                    { label: 'Age', value: `${patient?.age} years` },
                  ].map((item, index) => (
                    <React.Fragment key={item.label}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 1,
                          
                        }}
                      >
                        <Typography variant="h5" 
                        sx={{ color: '#518185', 
                            fontSize: '16px',
                        }}>
                          {item.label}:
                        </Typography>
                        <Typography variant="h5" 
                        sx={{ color: '#518185' ,
                            fontSize: '16px',
                            fontWeight: 'bold',
                        }}>
                          {item.value}
                        </Typography>
                      </Box>
                      {index < 3 && <Divider variant="middle"
                       sx={{ marginY: 1, 
                       backgroundColor: '#DFE8F6'
                       ,marginX : 0 }} />}
                    </React.Fragment>
                  ))}
                </Box>

                <Button
                  variant="contained"
                  sx={{
                    marginTop: 2,
                    fontFamily: 'Poppins, sans-serif',
                    backgroundColor: '#064B4F',
                    padding: '10px 30px',
                    fontSize: '16px',
                    width: 'fit-content',
                    alignSelf: 'center',
                  }}
                >
                  Edit Information
                </Button>
              </Card>
            </Box>
          </Box>
    </div>
  );
}

export default PatientDetailCardd;



