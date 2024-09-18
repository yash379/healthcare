import { Avatar, Box, Button, Card, Divider, Typography } from '@mui/material'
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { environment } from '../../../../environments/environment';
import { UserDetailsDto } from '@healthcare/data-transfer-types';

const checkupData = [
  {
    time: "8am - 10pm",
    title: "Medical Checkup",
    doctor: "Dr Parajay",
  },
  {
    time: "9am - 12pm",
    title: "Dental Checkup",
    doctor: "Dr Smith",
  },
  {
    time: "10am - 2pm",
    title: "Eye Checkup",
    doctor: "Dr Johnson",
  }
];

interface PatientDetailsDto {
  user: UserDetailsDto;
}
interface DoctorDetailsDto {
  user: UserDetailsDto;
}

export interface ViewAppointment {
  id: number;
  appointmentDate: string;
  status: { id: number; code: string; name: string };
  patient: PatientDetailsDto;
  doctor: DoctorDetailsDto;
}


function MedicalCheckup() {

  const [appointmentsData, setAppointmentsData] = useState<ViewAppointment[]>( []);
  const apiUrl = environment.apiUrl;
  const params=useParams();

  const getAllAppointments = useCallback(async () => {

    try {
      const response = await axios.get(
        `${apiUrl}/hospitals/${params.hospitalId}/appointments`,
        {
          withCredentials: true,
        }
      );
      // console.log(response.data[0].user)
      const { content, total } = response.data;
      console.log('Appointment Data', response.data.content);
      setAppointmentsData(response.data.content);
    } catch (error) {
      console.error('Error fetching hospital data:', error);
    };
  }, [apiUrl,  params.hospitalId, ]);

  useEffect(() => {
    getAllAppointments();
  }, [apiUrl,  params.hospitalId,  getAllAppointments]);
  

  return (
    <div style={{width:'50%',height:'375px', overflowY:'scroll', marginTop:'-28px', marginBottom:'10px'}}>
      <Box sx={{ display: 'flex' }} >
        <Box>
          
            {appointmentsData?.map((appointment, index) => (
              <Card
              sx={{
                // padding: 2,
                paddingLeft: 2,
                paddingBottom: 2.2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '120%',
                marginLeft: '2%',
                // height: '87%',
                borderRadius: '10px',
                margin:'9PX 0PX 0PX 8PX'
               
              }}
            >
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  width: '100%',
                  marginTop: 3,
                  alignItems: 'center',
                  flexDirection: "row",
                  margin: "20px 0px 0px 0px",
                }}
              >
                <Divider
                  orientation="horizontal"
                  flexItem
                  sx={{
                    backgroundColor: 'red',
                    width: '4px',
                    margin: '0 20px',
                    alignSelf: 'left',                  
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    marginTop: 3,
                    flexDirection: "column",
                    alignItems: 'left',
                  }}
                >
                  <Typography color="textPrimary"
                  sx={{ color: '#000000', 
                  fontWeight: 400 ,
                  fontSize: '16px',
                  
                  }}>
                    {appointment.appointmentDate}
                  </Typography>

                  <Typography variant="h6" color="textPrimary" 
                  sx={{ color: '#000000',
                    fontSize: '18px',
                   }}>
                    {appointment.id}
                  </Typography>

                  <Typography color="textPrimary"
                   sx={{ color: '#000000',
                    fontWeight: 300 ,
                    fontSize: '14px'
                    }}>
                    {appointment?.doctor.user.firstName}
                  </Typography>
                </div>
              </Box>
              </Card>
            ))}
         
        </Box>
      </Box>
    </div>
  )
}

export default MedicalCheckup
