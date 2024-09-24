import React,{useContext, useEffect, useRef, useState} from "react";
import styles from './profile-menu-button.module.scss';
import { AppBar, Avatar, Box, Button, IconButton, ListItemText, Paper, Select, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { UserContext } from "../../contexts/user-contexts";
import { Link, useNavigate } from 'react-router-dom';
// import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import UserImg from "../../../assets/User.png";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SettingsIcon from '@mui/icons-material/Settings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import LogoutIcon from '@mui/icons-material/Logout';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProfileMenuButtonProps {}

export function ProfileMenuButton(props: ProfileMenuButtonProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const navigate = useNavigate();
  const usercontext = useContext(UserContext);

  const userName = usercontext?.firstName || 'unknown user';
  const lastName = usercontext?.lastName || 'unknown user';
  const role = usercontext?.superRole || 'Unknown Role';
  const name = `${userName} ${lastName}`;

  const getUserInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  const userInitials = getUserInitials(userName, lastName);

  const handleSelectChange = (event: any) => {
    const selectedValue = event.target.value;
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
    navigate('/profile');
  };

  useEffect(()=>{
    setSelectedOption('');
  }, [selectedOption]);
  return (
       
    <Box className={styles['container']}>
    <Box
      className={styles['profile-dropdown']}
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
      <Avatar sx={{ width: 24, height: 24, bgcolor: 'purple', marginLeft: '4px', fontSize: '12px' }}>
        {userInitials}
      </Avatar>
      <Select
        value={selectedOption}
        onChange={handleSelectChange}
        displayEmpty
        renderValue={() => <Typography variant="body1">{name}</Typography>}
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
          <Typography variant="body1">{role}</Typography>
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
  </Box>
  );
}

export default ProfileMenuButton;