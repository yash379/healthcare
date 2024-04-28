import { Box, CircularProgress } from '@mui/material';
import TopBar from '../app-bar/app-bar';
import DrawerComponent from '../drawer-component/drawer-component';
import styles from './layout.module.scss';
import { Component, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/user-contexts';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { User, ViewUser } from '@healthcare/data-transfer-types';

/* eslint-disable-next-line */
export interface LayoutProps {
  user: User | null;
}

export function Layout({user}: LayoutProps) {
  const apiUrl = environment.apiUrl;
  // const user=localStorage.getItem('user');
  const navigate=useNavigate();
  

  useEffect(()=>{
    if(user==null){
      navigate("/login");
      console.log("User not logged in");       
    }
    
 },[navigate, user]);

 useEffect(() => {
  const fetchData = async () => {
    try {
      const loginResponse = await axios.get(`${apiUrl}/profile`, {
        withCredentials: true,
      });
      console.log('Login user', loginResponse.data);
      // navigate("/dashboard")
      if (!user?.superRole) {
        // enqueueSnackbar("User does not have a Super Role. Can't log in.", { variant: 'warning' });
        navigate("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  fetchData();
}, [apiUrl, navigate]);


  return (
    <div >
       {user == null ? (
        <Box>
          <CircularProgress />
        </Box>
      ) : (
      <UserContext.Provider value={user}>
      <TopBar />
      <div className={styles['container']}>
        <DrawerComponent />
        <div className={styles['outlet']}>
          <Outlet/>
        </div>
      </div>
      </UserContext.Provider>
        )}
    </div>
  );
}

export default Layout;
