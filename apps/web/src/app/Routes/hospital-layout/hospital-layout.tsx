import styles from './hospital-layout.module.scss';
import { useEffect, useState } from 'react';
import { Hospital } from '@healthcare/data-transfer-types';
import { environment } from '../../../environments/environment';
import { Outlet, useParams } from 'react-router-dom';
import { HospitalContext } from '../../contexts/user-context';
import axios from 'axios';

/* eslint-disable-next-line */
export interface HospitalLayoutProps {}

export function HospitalLayout(props: HospitalLayoutProps) {
  const [hospitalContext, setHospitalContext]=useState<Hospital | null>(null);
  const [hospital,setHospital]=useState<Hospital | null>(null);

  const apiUrl = environment.apiUrl;

  const params=useParams();

  const { hospitalId } = useParams<{ hospitalId: string }>();
  console.log("hospital id:",hospitalId);

  

  // useEffect(()=>{
  //   getHospital();
  // },[]);

  useEffect(()=>{
    const getHospital=async()=>{
      try{
        const response=await axios.get(`${apiUrl}/hospitals/${params.hospitalId}`,{
          withCredentials:true
        });
        console.log("Current hospital:",response.data);
        setHospital(response.data);
        setHospitalContext(response.data);
      }catch(error){
        console.log("Error in fetching hospital list",error);
      }
      
    } 
    getHospital();
  },[apiUrl, hospitalId, params.hospitalId]);


  return (
    <HospitalContext.Provider value={hospitalContext}>
       <Outlet/>
    </HospitalContext.Provider>
  );
}

export default HospitalLayout;
