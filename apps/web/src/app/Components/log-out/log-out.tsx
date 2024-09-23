import styles from './log-out.module.scss';
import { useContext, useEffect } from 'react';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import UserContext from '../../contexts/user-context';
import { Box, CircularProgress } from '@mui/material';

/* eslint-disable-next-line */
export interface LogOutProps {}

export function LogOut({onLogout}:{onLogout: () => void}) {

  const apiUrl = environment.apiUrl;

  const usercontext=useContext(UserContext);

  // const logout=async()=>{
  //   const response=await axios.post(`${apiUrl}/logout`)
  // }
  // useEffect(()=>{
  //   logout().then(onLogout);
  // },[usercontext?.user?.id]);
  // return <></>
  useEffect(() => {
    const logout = async () => {
      await axios.post(`${apiUrl}/logout`, null, {
        withCredentials: true,
      });
    };
    logout().then(onLogout);
  }, [apiUrl, onLogout,usercontext?.user?.id]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
}

export default LogOut;
