import { Outlet } from 'react-router-dom';
import styles from './appointment-layout.module.scss';
import AppointmentContext from '../../contexts/appointment-context';
import { useState } from 'react';
import { Appointment } from '@healthcare/data-transfer-types';
import { ViewAppointment } from '../../pages/list-appoinment-new/list-appointments/list-appointments';

/* eslint-disable-next-line */
export interface AppointmentLayoutProps {}

export function AppointmentLayout(props: AppointmentLayoutProps) {
  const [appointment,setAppointment]=useState<ViewAppointment | null>(null);
  return (
    <AppointmentContext.Provider value={{appointment,setAppointment}}>
    <div className={styles['container']}>
      <Outlet/>
    </div>
    </AppointmentContext.Provider>
  );
}

export default AppointmentLayout;
