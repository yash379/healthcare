import styles from './log-out.module.scss';
import { useContext, useEffect } from 'react';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import UserContext from '../../contexts/user-context';

/* eslint-disable-next-line */
export interface LogOutProps {}

export function LogOut({onLogout}:{onLogout: () => void}) {

  const apiUrl = environment.apiUrl;

  const usercontext=useContext(UserContext);

  const logout=async()=>{
    const response=await axios.post(`${apiUrl}/logout`)
  }
  useEffect(()=>{
    logout().then(onLogout);
  },[usercontext?.user?.id]);
  return <></>
}

export default LogOut;
