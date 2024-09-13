import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormFields from './FormFields';

interface Appointment {
  id?: string;  // Make id optional
  name: string;
  description: string;
  date: Date;
  time: string;
  toTime: string;
}

interface EditAppointmentProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSave: (updatedAppointment: Appointment) => void;
}

const validationSchema = yup.object().shape({
  id: yup.string(),
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  date: yup.date().required('Date is required'),
  time: yup.string().required('From Time is required'),
  toTime: yup.string().required('To Time is required'),
});

const EditAppointment: React.FC<EditAppointmentProps> = ({ open, onClose, appointment, onSave }) => {
  const { control, handleSubmit, reset } = useForm<Appointment>({
    resolver: yupResolver(validationSchema),
    defaultValues: appointment || {
      id: '',
      name: '',
      description: '',
      date: new Date(),
      time: '',
      toTime: '',
    },
  });

  React.useEffect(() => {
    if (appointment) {
      reset(appointment);
    }
  }, [appointment, reset]);

  const handleFormSubmit = (data: Appointment) => {
    if (appointment) {
      onSave({ ...data, id: appointment.id });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Edit Appointment
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon sx={{backgroundColor:'rgba(50, 50, 50, 1)',borderRadius:'50%', color:'white'}} />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{paddingTop: '0px',paddingBottom: '0px'}}>
          <FormFields control={control} />
        </DialogContent>
        <DialogActions sx={{ position: 'relative',float: 'left',paddingLeft:'25px' }}>
          
          <Button type="submit" variant="contained" color="primary"  sx={{backgroundColor:'rgba(52, 125, 125, 1)',color :'rgba(255, 255, 255, 1)',fontFamily: 'Poppins', fontWeight: 600,fontSize: '16px', lineHeight: '20px'}} >
            Save Changes
          </Button>
          <Button onClick={onClose}  sx={{color :'rgba(52, 126, 125, 1)',fontFamily: 'Poppins', fontWeight: 500,fontSize: '14px', lineHeight: '24px',letter:'0.4px'}}>Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditAppointment;
