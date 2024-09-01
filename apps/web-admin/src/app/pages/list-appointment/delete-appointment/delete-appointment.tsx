import { Box, Button, Dialog, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
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
    // <Dialog open={open} onClose={onClose}>
    //   <Box className={styles['delete_modal_container']}>
    //   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '' }}>
    //     <DialogTitle className={styles['h2_tag']} >Add Appointment </DialogTitle>
    //     <IconButton onClick={() => { onClose() }}>
    //       <CancelIcon></CancelIcon>
    //     </IconButton>
    //   </Box>
    //     <p>
    //       Are you sure you want to delete patient{' '}
    //       <b>{appointmentData?.firstName + ' ' + appointmentData?.lastName}</b>?
    //     </p>

    //     <Grid container spacing={2} justifyContent="flex-end">
    //       <Grid item xs={12} md={6} className={styles['grid_top']}>
    //         <Button variant="contained" color="secondary" onClick={onClose}>
    //           Cancel
    //         </Button>
    //       </Grid>
    //       <Grid item>
    //         <Button
    //           className={styles['delete_btn']}
    //           color='error'
    //           variant="contained" 
    //           onClick={() => {
    //             onDelete();
    //             onClose();
    //           }}

    //         >
    //           delete
    //         </Button>
    //       </Grid>
    //     </Grid>
    //   </Box>
    // </Dialog>



    <Dialog
      open={open}
      onClose={onClose}

    >
      <Box className={styles['delete_modal_container']} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <DialogTitle className={styles['h2_tag']}>Delete Appointment</DialogTitle>
          <IconButton onClick={onClose}>
            <CancelIcon />
          </IconButton>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1">
            Are you sure you want to delete patient{' '}
            <b>{appointmentData?.firstName + ' ' + appointmentData?.lastName}</b>?
          </Typography>
        </Box>

        <Grid container spacing={1} sx={{ justifyContent: 'flex-end' }}>
          <Grid item xs={6} md={4} className={styles['grid_top']}>
            <Button variant="contained" color="secondary" onClick={onClose} fullWidth>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6} md={4}>
            <Button
              sx={{ marginLeft: '5px' }}
              className={styles['delete_btn']}
              color="error"
              variant="contained"
              onClick={() => {
                onDelete();
                onClose();
              }}
              fullWidth
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Dialog>

  );
}

export default DeleteAppointment;
