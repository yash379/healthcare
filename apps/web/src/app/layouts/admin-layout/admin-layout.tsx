import { Outlet, useParams } from 'react-router-dom';
import styles from './admin-layout.module.scss';
import TopBar from '../../Components/app-bar/app-bar';
import AdminNav from '../../Components/admin-nav/admin-nav';
import { useContext, useEffect } from 'react';
import HospitalContext from '../../contexts/hospital-context';
import { environment } from '../../../environments/environment';
import axios from 'axios';

/* eslint-disable-next-line */
export interface AdminLayoutProps {}

export function AdminLayout(props: AdminLayoutProps) {
  const hospitalcontext=useContext(HospitalContext);
  const apiUrl = environment.apiUrl;
  console.log("hospital Context:", hospitalcontext?.hospital);

  const params=useParams();
  const getHospital=async()=>{
    const response=await axios.get(
     `${apiUrl}/hospitals/${params.hospitalId}`,
     {
       withCredentials: true,
     }
   );
   hospitalcontext?.setHospital(response.data);
   console.log("response hospitalId:", response.data);
 }

 useEffect(()=>{
  getHospital();
},[params.hospitalId]);

  return (
    <div className={styles['container']}>
      <TopBar/>
      <AdminNav/>
      <div className={styles['outlet']}> 
      <Outlet/>
      </div>
    </div>
  );
}

export default AdminLayout;
