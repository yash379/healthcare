import styles from './log-out.module.scss';
import { useEffect } from 'react';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Box, CircularProgress } from '@mui/material';

/* eslint-disable-next-line */
export interface LogOutProps {}

export function LogOut({onLogout}:{onLogout: () => void}) {

  const apiUrl = environment.apiUrl;

  // const logout=async()=>{
  //   const response=await axios.post(`${apiUrl}/logout`, null, {
  //     withCredentials: true,
  //   })
  // }
  // useEffect(()=>{
  //   logout().then(onLogout);
  // },[])
  // return <></>
  useEffect(() => {
    const logout = async () => {
      await axios.post(`${apiUrl}/logout`, null, {
        withCredentials: true,
      });
    };
    logout().then(onLogout);
  }, [apiUrl, onLogout]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
}

export default LogOut;
