import { Box, Button, Dialog, DialogTitle, Grid, IconButton } from '@mui/material';
import styles from './delete-appointment.module.scss';
import CancelIcon from '@mui/icons-material/Cancel';
import { Form } from '../add-appointment/add-appointment';
import { Padding } from '@mui/icons-material';
import { useEffect } from 'react';

/* eslint-disable-next-line */
export interface DeleteAppointmentProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  appointmentData: Form | null;
}

const DeleteAppointment: React.FC<DeleteAppointmentProps> = ({ open, onClose, onDelete, appointmentData }) => {


  
  return (
    <Dialog open={open} onClose={onClose}>
      <Box className={styles['delete_modal_container']}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '' }}>
        <DialogTitle className={styles['h2_tag']} >Add Appointment </DialogTitle>
        <IconButton onClick={() => { onClose() }}>
          <CancelIcon></CancelIcon>
        </IconButton>
      </Box>
        <p>
          Are you sure you want to delete patient{' '}
          <b>{appointmentData?.firstName + ' ' + appointmentData?.lastName}</b>?
        </p>

        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item xs={12} md={6} className={styles['grid_top']}>
            <Button variant="contained" color="secondary" onClick={onClose}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              className={styles['delete_btn']}
              variant="contained"
              color="error"
              onClick={() => {
                onDelete();
                onClose();
              }}
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}

export default DeleteAppointment;
