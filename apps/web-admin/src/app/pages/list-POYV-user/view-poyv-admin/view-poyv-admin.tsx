import styles from './view-poyv-admin.module.scss';
import React, { useContext } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Modal,
  Typography,
} from '@mui/material';
import user from '../../../../assets/UserProfile.png';
import CancelIcon from '@mui/icons-material/Cancel';
import { stringAvatar } from "../../../utils/user";

export interface ViewPOYVUserComponentProps {
  open: boolean;
  onClose: () => void;
  initialData: POYVUser | null;
}

interface POYVUser {
  id:number;
  superRole:string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  isActive:boolean;
  }


const ViewPOYVUserComponent: React.FC<ViewPOYVUserComponentProps> = ({ open, onClose, initialData }) => {

  function insertSpacesBetweenWords(text:string) {
    const words = text.split('_');
    const formattedWords = words.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return formattedWords.join(' ');
  }

  if (!initialData) {
    return null; 
  }

  const getUserInitials = (firstName?: string, lastName?: string) => {
    const firstInitial = firstName?.charAt(0).toUpperCase();
    const lastInitial = lastName?.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };
  const userInitials = getUserInitials(initialData?.firstName, initialData?.lastName);
  return (

    <Dialog open={open} onClose={onClose}  maxWidth="xs" fullWidth>
      <Box  >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            // width: '400px',
            // height: '104px',
            background: 'linear-gradient(180deg, #D9D9D9 0%, #737373 100%)',
            borderTopRightRadius: '12px',
            borderTopLeftRadius: '12px',
            maxHeight:"100px"
          }}>
            
            <Avatar
            sx={{
              width: '127px',
              height: '127px',
              fontWeight: '400',
              bgcolor: 'white',
              color: 'black',
              // marginLeft: '4px',
              fontSize: '50px',
              borderBottomColor: '#3D7793',
              borderBottom: '1px solid #3D7793',
              top: '33px',
            }}>
            {userInitials}
          </Avatar>
          <IconButton
            onClick={() => {
              onClose();
            }}
            aria-label="Close"
            sx={{
              position: 'absolute', // Set position to absolute
              top: '2px', // Adjust top positioning as needed
              right: '2px', // Adjust right positioning as needed
            }}
            >
            <CancelIcon />
          </IconButton>
        </Box>
        <Box display={"flex"} flexDirection={'column'} >
          <Box sx={{ paddingBottom: 0 }}>
            {initialData && (
              <Box className={styles['modal_second_container']}>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'black',
                      fontWeight: 500,
                      fontSize: '24px',
                      marginTop: '70px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}>
                    {initialData.firstName} {initialData.lastName}
                  </Typography>
                </Box>

                <Box sx={{ ml: '34px', mr: '34px', mt: '30px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}>
                    <Typography
                      variant="body1"
                      sx={{ display: 'flex', gap: '108px' }}>
                      <Typography>Status</Typography>
                      <Typography
                        sx={{
                          textWrap: 'wrap',
                          lineBreak: 'anywhere',
                          whiteSpace: 'break-spaces',
                        }}
                        color={initialData.isActive ? '#1A8B18' : 'error'}>
                        {initialData.isActive ? 'Active' : 'Inactive'}
                      </Typography>
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ display: 'flex', gap: initialData.email.length > 25 ? '94px' : '94px' }}>
                      <Typography>Email ID</Typography>
                      <Typography sx={{ flex: 1, wordBreak: 'break-word', textAlign: 'left' }}>
                        {initialData.email}
                      </Typography>
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ display: 'flex', gap: initialData.superRole.length > 25 ? '94px' : '120px' }}>
                      <Typography>Role</Typography>
                      <Typography sx={{ flex: 1, wordBreak: 'break-word', textAlign: 'left' }}>
                        {initialData.superRole}
                      </Typography>
                    </Typography>
                    {/* <Typography
                      variant="body1"
                      sx={{ display: 'flex', gap: (initialData?.employeeId?.length ?? 0) > 25 ? '66px' : '68px'   }}>
                      <Typography>Employee ID</Typography>
                      <Typography sx={{ flex: (initialData?.employeeId?.length ?? 0) > 25 ? 1 : null, wordBreak: 'break-word', textAlign: 'left'  }}>
                        {initialData.employeeId ? initialData.employeeId : '-'}
                      </Typography>
                    </Typography> */}
                    {/* <Typography
                      variant="body1"
                      sx={{ display: 'flex', gap: '80px' }}>
                      <Typography>User Roles</Typography>
                      <Typography sx={{  whiteSpace: 'pre-line', textAlign:'left'  }}>
                        {initialData.role.length !== 0
                          ? capitalize(initialData.role.join('\n'))
                          : '-'}
                      </Typography>
                    </Typography> */}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '11px',
                m: 2,
              }}>
             
              {/* <Button
                sx={{ borderRadius: '12px' }}
                variant="contained"
                color="secondary"
                onClick={() => {
                  onClose();
                }}>
                Cancel
              </Button> */}
              {/* <Button
                onClick={handleEditClick}
                variant="contained"
                type="submit"
                color="primary"
                sx={{ borderRadius: '12px' }}>
                Edit
              </Button> */}
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}

export default ViewPOYVUserComponent;
