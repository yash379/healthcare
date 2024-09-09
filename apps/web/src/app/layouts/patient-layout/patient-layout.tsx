import styles from './patient-layout.module.scss';
import { ReactNode, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { PatientContext } from '../../contexts/patient-context';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { Patient, ViewPatient } from '@healthcare/data-transfer-types';
import { Box } from '@mui/material';
import TopBar from '../../Components/app-bar/app-bar';
import DrawerComponent from '../../Components/drawer-component/drawer-component';
import PatientNav from '../../Components/patient-nav/patient-nav';
/* eslint-disable-next-line */
export interface PatientLayoutProps {
  children?: ReactNode;
}

export function PatientLayout({ children }: PatientLayoutProps) {
  const params = useParams();
  const apiUrl = environment.apiUrl;
  const [patientContext, setPatientContext]=useState<Patient | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  useEffect(() => {
    const getPatient = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/hospitals/1/patients/${params.patientId}`,
          {
            withCredentials: true,
          },
        );
        console.log('patient in layout', response.data);
        setPatient(response.data);
        setPatientContext(response.data);
      } catch (error) {
        console.log('error', error);
      }
    };
    getPatient();
  }, [params, apiUrl]);
  
  console.log('params', params);
  return (
  <PatientContext.Provider value={{patient,setPatient}}>
    <TopBar />
    <PatientNav />
    <Box className={styles['Box']}>
              <Outlet />
    </Box>
 </PatientContext.Provider>
  );
}

export default PatientLayout;
