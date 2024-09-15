import { Box, Card } from '@mui/material'
import React from 'react'
import Schedule from '../Appointment_comp/Schedule'
import Appointments from '../Appointment_comp/Appointments'
import CancellationDetailCard from '../Appointment_comp/CancelAppointment'
import DoctorSpecialization from '../Appointment_comp/DoctorSpecialization'
import DoctorAvailability from '../Appointment_comp/DoctorAvailability'
import AppointmentType from '../Appointment_comp/AppointmentType'
import { Margin } from '@mui/icons-material';


export default function AppointmentPage() {
  return (
    <div style={{display:'flex', flexDirection:'row'}}>
      {/* <Card
      sx={{
        display: 'flex',
        flexDirection: 'row',
        borderRadius: '10px',
        padding:'20px'
      }}
      >  */}
        
        <Schedule/>               
        <Box
        sx={{
          flexDirection: 'column',
          // alignItems: 'center',
          justifyContent: 'space-between',
          width: '80%',
          display:'flex'
        }}>
          <Appointments/>         
          {/* <Box
            sx={{
              marginTop:'20px '
            }}
          > */}
          <CancellationDetailCard/>
          {/* </Box> */}
        </Box>
      {/* </Card> */}
    </div>
  )
}
