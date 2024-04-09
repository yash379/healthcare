import styles from './patient-layout.module.scss';
import { ReactNode, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { PatientContext } from '../../contexts/patient-context';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { Patient, ViewPatient } from '@healthcare/data-transfer-types';
/* eslint-disable-next-line */
export interface PatientLayoutProps {
  children?: ReactNode;
}

export function PatientLayout({ children }: PatientLayoutProps) {
  const params = useParams();
  const apiUrl = environment.apiUrl;
  const [patientContext, setPatientContext]=useState<Patient | null>(null);
  const [patient, setPatient] = useState<ViewPatient>({} as ViewPatient);
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
    <PatientContext.Provider value={patientContext}>
    <Outlet/>
 </PatientContext.Provider>
  );
}

export default PatientLayout;
