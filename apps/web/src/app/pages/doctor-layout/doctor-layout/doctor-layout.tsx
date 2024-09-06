import { Doctor } from '@healthcare/data-transfer-types';
import styles from './doctor-layout.module.scss';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { environment } from '../../../../environments/environment';
import { useParams } from 'react-router-dom';
import UserContext from '../../../contexts/user-context';
import DoctorContext from '../../../contexts/doctor-context';


/* eslint-disable-next-line */
export interface DoctorLayoutProps {}

export function DoctorLayout(props: DoctorLayoutProps) {

  const apiUrl = environment.apiUrl;
  const params = useParams();
  const [doctor, setDoctor]=useState<Doctor | null>(null);
  const [doctorId, setDoctorId]=useState<number | null>(null);
  const [hospitalId, sethospitalId]=useState(0);

  const usercontext=useContext(UserContext);
  const doctorContext=useContext(DoctorContext);


    useEffect(()=>{
    if(usercontext?.user?.hospitalRoles?.map((role)=>role.hospitalRole==='DOCTOR')){
      usercontext?.user?.hospitalRoles?.map((role)=>
       { if(role.hospitalRole==='DOCTOR'){
          sethospitalId(role.hospitalId);
          setDoctorId(usercontext?.user && usercontext?.user?.id)
        }}
      )
    

    const getDOCTOR = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/hospitals/${hospitalId}/doctors/${doctorId}`,
            {
              withCredentials: true,
            }
          );
          // console.log(response.data[0].user)
          const { content, total } = response.data;
          console.log('DOCTOR Data', response.data.content);
          doctorContext?.setDoctor(response.data);
        } catch (error) {
          console.error('Error fetching hospital data:', error);
        }
    }

    getDOCTOR();
   }},[usercontext?.user]);

  

  return (
    <div className={styles['container']}>
      <h1>Welcome to DoctorLayout!</h1>
    </div>
  );
}

export default DoctorLayout;
