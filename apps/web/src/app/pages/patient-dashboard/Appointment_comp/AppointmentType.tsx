import React, { useContext, useState } from 'react';
import { Box, Typography, FormControlLabel, Checkbox, Card, CardContent, Button } from '@mui/material';
import { ViewAllUser } from '@healthcare/data-transfer-types';
import HospitalContext from '../../../contexts/hospital-context';
import axios from 'axios';
import { environment } from '../../../../environments/environment';
import PatientContext from '../../../contexts/patient-context';
import { enqueueSnackbar } from 'notistack';
import AddAppointment from '../list-appointments/hospital-add-appointment/hospital-add-appointment'

interface Form {
  doctor: ViewAllUser | null;
  patient: ViewAllUser | null;
  appointmentDate: Date;
  statusId: number;
}


const appointmentTypes = [
  {
    title: 'Introduction',
    description: 'If you need a consultation to get the diagnosis',
  },
  {
    title: 'Problem discussion',
    description: 'If you have a diagnosis and need a therapy',
  },
];

const AppointmentType = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const hospitalcontext=useContext(HospitalContext);
  const patientcontext=useContext(PatientContext);
  const apiUrl = environment.apiUrl;

  // Add Appointment
  const handleAddAppointment = async (formData: Form) => {
    try {
      await setIsAddModalOpen(false);

      const { data: responseData } = await axios.post(
        `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/doctors/${formData?.doctor?.id}/patients/${patientcontext?.patient?.id}/appointments`,
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


  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom sx={{color:'#064B4F'}}>
        Appointment Type
      </Typography>
      <Box display="flex" gap={1}>
        {appointmentTypes.map((type, index) => (
          <FormControlLabel
            key={index}
            control={<Checkbox />}
            label={
              <Card
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  padding: 2,
                  boxShadow: 'none',
                  minWidth: 200,
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold"sx={{color:'#064B4F'}}>
                    {type.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary"sx={{color:'#064B4F'}}>
                    {type.description}
                  </Typography>
                </CardContent>
                
              </Card>
              
            }
            
          />
          
        ))}
        
      </Box>
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button variant="contained" sx={{
                    backgroundColor: '#064B4F',
                  }}
                  // onClick={() => setIsAddModalOpen(true)}
          >
          {/* <AddAppointment
              open={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSubmit={handleAddAppointment}
          /> */}
        
          Book Appointment
        </Button>
        
      </Box>
    </Box>
  );
};

export default AppointmentType;
