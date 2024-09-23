import { Doctor } from '@healthcare/data-transfer-types';
import styles from './doctor-layout.module.scss';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Outlet, useParams } from 'react-router-dom';
import UserContext from '../../contexts/user-context';
import DoctorContext from '../../contexts/doctor-context';
import TopBar from '../../Components/app-bar/app-bar';
import DrawerComponent from '../../Components/drawer-component/drawer-component';
import { Box } from '@mui/material';
import HospitalContext from '../../contexts/hospital-context';
import DoctorNav from '../../Components/doctor-nav/doctor-nav';


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

  const hospitalcontext=useContext(HospitalContext);


  // const params=useParams();

    useEffect(()=>{
    // if(usercontext?.user?.hospitalRoles?.map((role)=>role.hospitalRole==='DOCTOR')){
    //   usercontext?.user?.hospitalRoles?.map((role)=>
    //    { if(role.hospitalRole==='DOCTOR'){
    //       sethospitalId(role.hospitalId);
    //       setDoctorId(usercontext?.user && usercontext?.user?.id)
    //     }}
    //   )
    

    const getDOCTOR = async () => {
      console.log("hospital id:", hospitalcontext?.hospital?.id);
        try {
          const response = await axios.get(`${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/doctors/${usercontext?.user?.doctorId}`,
            {
              withCredentials: true,
            }
          );
          // console.log(response.data[0].user)
          const { content, total } = response.data;
          console.log('DOCTOR Data', response.data);
          setDoctor(response.data);
          localStorage.setItem('doctor', JSON.stringify(response.data));
          doctorContext?.setDoctor(response.data);
        } catch (error) {
          console.error('Error fetching doctor data:', error);
        }
    }

    const getHospital=async()=>{
      try{
        const response=await axios.get(`${apiUrl}/hospitals/${params.hospitalId}`,
          {
            withCredentials: true,
          }
        );
        console.log("Hospital:",response.data);
        hospitalcontext?.setHospital(response.data);
      }catch(error){
        console.error("Error in fecthing hospital:", error);
      }
    }

    getHospital();

    getDOCTOR();
  //  }
  },[usercontext?.user, params.hospitalId, params.doctorId, doctorContext?.doctor?.id,hospitalcontext?.hospital?.id]);

  

  return (
    <DoctorContext.Provider value={{doctor, setDoctor}}>
    <div className={styles['container']}>
      <TopBar/>
     <DoctorNav/>
     <div className={styles['outlet']}>
        {/* <Box className={styles['Box']}> */}
          <Outlet />
        {/* </Box> */}
     </div>
    </div>
   </DoctorContext.Provider>
  );
}

export default DoctorLayout;
