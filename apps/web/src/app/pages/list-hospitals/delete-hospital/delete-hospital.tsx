import styles from './delete-hospital.module.scss';
import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Modal,
  Typography,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { AddHospital } from '@healthcare/data-transfer-types';

export interface DeleteHospitalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  hospitalData: AddHospital | null;
}

const DeleteHospitalComponent: React.FC<DeleteHospitalProps> = ({
  open,
  onClose,
  onDelete,
  hospitalData
}) => {
  const [uploadError, setUploadError] = useState<Error>();
  const [isUploading, setIsUploading] = useState(false);
  
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
      {uploadError && (
        <Alert severity="error" onClose={() => setUploadError(undefined)}>
          There was an error Activating / Deactivating Hospital. Please try again.
        </Alert>
      )}
      <Typography>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: '12px',
            }}
            variant='h2'>
            {hospitalData?.isActive ? 'Deactivate' : 'Activate'} Hospital
          </Typography>
          <IconButton
            onClick={() => {
              onClose();
            }}
            aria-label="Close"
            sx={{ p: '12px' }}>
            <CancelIcon />
          </IconButton>
        </Box>
        {/* <p>Are you sure you want to delete <b>{hospitalData?.name}</b> hospital?</p>
        <Box className={styles['modal-buttons']}>
         
          <Button variant="contained" color="secondary" onClick={onClose}>
            Cancel
          </Button>
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
        </Box>
      </Box>
    </Modal> */}

        <Typography p={'12px'} variant="body1">
          {hospitalData?.isActive
            ? `Are you sure you want to deactivate ${hospitalData?.name} ?`
            : `Are you sure you want to activate ${hospitalData?.name}?`}
        </Typography>
      </Typography>
      <Typography
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '10px',
        }}>

        <Button
          className={styles.ButtonColorClose}
          onClick={onClose}
          variant="contained"
          color="secondary"
          sx={{marginRight: '12px', borderRadius: '12px' }}
          disabled={isUploading}>
          Cancel
        </Button>
        <Button
           onClick={() => {
            onDelete();
            onClose();
          }}
          variant="contained"
          disabled={isUploading}
          color={hospitalData?.isActive ? 'error' : 'success'}
          sx={{  borderRadius: '12px' }}>
          {hospitalData?.isActive ? 'Deactivate' : 'Activate'}
        </Button>
      </Typography>
    </Box>
  </Dialog>
  );
}

export default DeleteHospitalComponent;
