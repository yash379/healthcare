import styles from './delete-admin.module.scss';

import { Box, Button, Dialog, DialogTitle, Grid, IconButton, Typography } from '@mui/material';

import CancelIcon from '@mui/icons-material/Cancel';
/* eslint-disable-next-line */
export interface DeleteAdminProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  adminData: Manager | null;
}


interface Manager {
  id: number;
  isPrimary: boolean;
  hospitalRole: {
    name: string;
  },
  user: {
    id: number;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
  }
}

export function DeleteAdmin({
  open,
  onClose,
  onDelete,
adminData
}: DeleteAdminProps) {
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
              Delete Manager
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
          <Typography p={'12px'} variant="body1">
              {`Are you sure you want to delete ${adminData?.user.firstName} ${adminData?.user?.lastName}?`}
            
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
            >
            Cancel
          </Button>
          <Button
            onClick={onDelete}
            variant="contained"
            color='error'
            sx={{  borderRadius: '12px' }}>
              Delete
          </Button>
        </Typography>
      </Box>
    </Dialog>
  );
}

export default DeleteAdmin;
