import styles from './delete-poyv-admin.module.scss';
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
import { useState } from 'react';

/* eslint-disable-next-line */
export interface DeletePOYVAdminProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  Status: boolean | undefined ;
  userData: POYVUser | null;
}

interface POYVUser {
  id: number;
  superRole: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}


export function DeletePOYVAdmin({
  open,
  onClose,
  onDelete,
  Status,
  userData
}: DeletePOYVAdminProps) {

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
          There was an error Activating / Deactivating User. Please try again.
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
            {Status ? 'Deactivate' : 'Activate'} User
            </Typography>
          <IconButton
            onClick={() => {
              onClose();
            }}
            aria-label="Close"
            sx ={{ p: '12px' }}>
            <CancelIcon />
          </IconButton>
        </Box>
        <Typography p={'12px'} variant="body1">
          {Status
            ? `Are you sure you want to deactivate ${userData?.firstName} ${userData?.lastName}?`
            : `Are you sure you want to activate ${userData?.firstName} ${userData?.lastName}?`}
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
          color={Status ? 'error' : 'success'}
          sx={{  borderRadius: '12px' }}>
          {Status ? 'Deactivate' : 'Activate'}
        </Button>
      </Typography>
    </Box>
  </Dialog>
  );
}

export default DeletePOYVAdmin;
