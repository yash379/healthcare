import { useEffect, useState } from 'react';
import styles from './hospital-layout.module.scss';
import { Hospital } from '@healthcare/data-transfer-types';
import { environment } from '../../../environments/environment';
import { Outlet, useParams } from 'react-router-dom';
import { HospitalContext } from '../../contexts/user-contexts';
import axios from 'axios';

/* eslint-disable-next-line */
export interface HospitalLayoutProps {}

export function HospitalLayout(props: HospitalLayoutProps) {
  const [hospitalContext, setHospitalContext]=useState<Hospital | null>(null);
  const [hospital,setHospital]=useState<Hospital | null>(null);

  const apiUrl = environment.apiUrl;

 

  const { hospitalId } = useParams<{ hospitalId: string }>();
  console.log("hospital id:",hospitalId);

  const params=useParams();

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
  },[hospitalId]);


  return (
    <HospitalContext.Provider value={hospitalContext}>
       <Outlet/>
    </HospitalContext.Provider>
  );
}

export default HospitalLayout;
