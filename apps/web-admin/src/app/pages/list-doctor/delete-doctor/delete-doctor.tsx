import styles from './delete-doctor.module.scss';
import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Gender } from '@prisma/client';
import { ViewDoctor } from '@healthcare/data-transfer-types';
import CancelIcon from '@mui/icons-material/Cancel';
import { Dialog, IconButton, Typography } from '@mui/material';

export interface DeleteDoctorProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  doctorData: ViewDoctor | null;
}


// interface EditForm {
//   firstName: string;
//   lastName: string;
//   email: string;
//   gender: Gender;
//   phoneNumber: string;
//   doctorCode: string;
//   speciality: string;
//   isActive: boolean;
// }

const DeleteDoctorComponent: React.FC<DeleteDoctorProps> = ({
  open,
  onClose,
  onDelete,
  doctorData
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
    <Box
      sx={{
        // position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        // top: '50%',
        // left: '50%',
        // transform: 'translate(-50%, -50%)',
        backgroundColor: '#ffffff',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        height: '100%',
        maxHeight: '148px',
        padding: '12px 12px 12px 12px',
        // width: '100%',
        // maxWidth: '420px',
        borderRadius: '12px',
      }}>
      {/* <Typography> */}
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: '12px',
            }}
            variant='h2'>
              Delete Doctor</Typography>
            <IconButton
            onClick={() => {
              onClose();
            }}
            aria-label="Close"
            sx={{ p: '12px' }}>
            <CancelIcon />
          </IconButton>
        </Box>
        <Typography p={'12px'} variant="body1">
        Are you sure you want to delete {doctorData?.firstName + ' ' + doctorData?.lastName} 
        </Typography>
        <Typography
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '10px',
        }}>
          <Button variant="contained" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className={styles['delete_btn']}
            variant="contained"
            color="error"
            sx={{ml:'10px'}}
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            Delete
          </Button>
          </Typography>
    </Box>
  </Dialog>
  );
}

export default DeleteDoctorComponent;
