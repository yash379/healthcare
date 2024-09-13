


import React from 'react';
import { Box, Card, Typography, Button, Divider } from '@mui/material';

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

function PatientDetailCardd() {
  const patients: Patient[] = [
    {
      id: 1,
      patientid: '12345',
      name: 'John Doe',
      appointments: 5,
      completed: 3,
      weight: 70,
      height: 182,
      bloodpressure: '120/80',
      disease: 'Diabetes',
      gender: 'Male',
      age: 24,
    },
  ];

  return (
    <div style={{width:'50%'}}>
      {patients &&
        patients.map((patient) => (
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }} key={patient.id}>
            <Box>
              <Card
                sx={{
                  padding: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  height: 'auto',
                  borderRadius: '10px',
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
                    { label: 'Weight', value: `${patient.weight} kg` },
                    { label: 'Height', value: `${patient.height} cm` },
                    { label: 'Gender', value: patient.gender },
                    { label: 'Age', value: `${patient.age} years` },
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
        ))}
    </div>
  );
}

export default PatientDetailCardd;



