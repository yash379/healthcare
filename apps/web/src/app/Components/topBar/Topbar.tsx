import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import styles from './topbar.module.scss';
import Breadcrumbs from '../bread-crumbs/bread-crumbs';
import UserContext from '../../contexts/user-context';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { SnackbarProvider } from 'notistack';
import { Avatar, Box, ListItemText, MenuItem, Select, Typography } from '@mui/material';
import React from 'react';
import Profile from '../profile/profile';


// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TopbarProps {}

export function Topbar(props: TopbarProps) {
  const apiUrl = environment.apiUrl;
  const [total, setTotal] = useState<number | null>(null);
  const [openProfile, setOpenProfile] = useState(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const navigate = useNavigate();

  const usercontext = useContext(UserContext);
  console.log("usercontext:", usercontext, usercontext?.user?.firstName, usercontext?.user?.lastName, usercontext?.user?.hospitalRoles);

  const getUserInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  const userName = usercontext?.user?.firstName || 'unknown user';
  const lastName = usercontext?.user?.lastName || 'unknown user';
  const role = usercontext?.user?.superRole || 'Unknown Role';
  const name = `${userName} ${lastName}`;
  console.log("userName:", name);
  const userInitials = getUserInitials(userName, lastName);


  const handleProfileClick = (event: any) => {
    setOpenProfile(event.currentTarget);
  };

  const handleProfileClose = () => {
    setOpenProfile(null);
  };

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

  const [activities, setActivities] = useState(['Project Admin', 'Masters']);

  const clientChangeHandler = (id: number) => {
    navigate(`/clients/${id}`);
  };

  const projectChangeHandler = (id: number) => {
    // navigate(`/clients/${clientContext.client}/projects/${id}`);
  };


  const breadcrumbs = [
    {
      to: '/',
      label: 'Home'
    },
  ];

  return (
    <div className={styles['container']}>
      <header className={styles['topbar']}>
        <div style={{ display: 'flex', alignItems: 'flex-start', flex:1, height: '52px', }}>
          <div style={{ flex: 1, height: '52px', alignContent: 'center'}}>
            <Breadcrumbs paths={breadcrumbs} />
          </div>
          <div style={{height: '52px', alignContent: 'center'}}>
          <Profile/>
          </div>
        </div>
        {/* The remaining code for dropdowns, search field, etc., can be uncommented and styled as needed */}
        <Box>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={2000}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          />
        </Box>
      </header>
    </div>
  );
}

export default Topbar;
