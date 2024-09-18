import { useState, useContext, useEffect } from 'react';
import { Box, Select, MenuItem, Typography, Avatar, ListItemText } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import styles from './profile-menu-button.scss';
import UserContext from '../../contexts/user-context';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import HospitalContext from '../../contexts/hospital-context';
import DoctorContext from '../../contexts/doctor-context';
import PatientContext from '../../contexts/patient-context';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProfileMenuButtonProps {}

export function ProfileMenuButton(props: ProfileMenuButtonProps) {
  const apiUrl = environment.apiUrl;
  const [selectedOption, setSelectedOption] = useState<string>('');
  const navigate = useNavigate();
  const usercontext = useContext(UserContext);
  console.log(usercontext, 'usercont')
  const userName = usercontext?.user?.firstName || 'unknown user';
  const lastName = usercontext?.user?.lastName || 'unknown user';
  // const role = usercontext?.role || 'Unknown Role';
  const [userRole, setUserRole] = useState<string>('Unknown Role');
  const name = `${userName} ${lastName}`;

  const hospitalcontext=useContext(HospitalContext);
  const doctorcontext=useContext(DoctorContext);
  const patientcontext=useContext(PatientContext);

  const getUserInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  const userInitials = getUserInitials(userName, lastName);

  const handleSelectChange = (event: any) => {
    const selectedValue = event.target.value;
    console.log("event:", event.target.value);
    setSelectedOption(selectedValue);

    if (selectedValue === 'profile') {
      handleProfile();
    } else if (selectedValue === 'logout') {
      handleLogout();
    }
  };

  const handleLogout = () => {
    navigate('/logout');
  };

  const handleProfile = () => {
    if(doctorcontext?.doctor){
      navigate(`/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext.doctor?.id}/profile`);
    }else if(patientcontext?.patient){
      navigate(`/hospitals/${hospitalcontext?.hospital?.id}/patients/${patientcontext?.patient?.id}/profile`)
    }else{
      navigate(`/hospitals/${hospitalcontext?.hospital?.id}/admin/${usercontext?.user?.id}/profile`)
    }
  };

  useEffect(()=>{
    setSelectedOption('');
  }, [selectedOption]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #ccc',
          borderRadius: '4px',
          height: '39px',
          gap: '8px',
          marginRight: '12px',
        }}
      >
        <Avatar sx={{ width: 24, height: 24, bgcolor: '#064B4F', marginLeft: '4px', fontSize: '12px' }}>
          {userInitials}
        </Avatar>
        <Select
          value={selectedOption}
          onChange={handleSelectChange}
          displayEmpty
          renderValue={() => <div style={{display:'flex',flexDirection:'column'}}><Typography variant="body1">{name}</Typography>
          <Typography variant='body2'>{usercontext?.user?.superRole}</Typography>
          </div>}
          sx={{
            '.MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            },
            '.MuiOutlinedInput-notchedOutline': { border: 'none' },
          }}
        >
          {/* <MenuItem disabled value="">
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', textAlign: 'left' }}>{userRole}</Typography>
          </MenuItem> */}
          <MenuItem value="profile">
            <PersonIcon
              sx={{
                height: '15px',
                width: '15px',
                marginRight: '5px',
              }}
            />
            <ListItemText primary="Profile" />
          </MenuItem>
          <MenuItem value="logout">
            <LogoutIcon
              sx={{
                height: '15px',
                width: '15px',
                marginRight: '5px',
              }}
            />
            <ListItemText primary="Logout" />
          </MenuItem>
        </Select>
      </Box>
      <Box>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={2000}
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        />
      </Box>
    </Box>
  );
}

export default ProfileMenuButton;