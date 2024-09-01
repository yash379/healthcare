import styles from './view.module.scss';
import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import React from 'react';
// import DoctorList from "../list-doctor/list-doctor";
import HospitalView from '../list-hospitals/view-hospital-page/view-hospital-page';
import ListDoctors from '../list-doctor/list-doctor';
import ListPatients from '../list-patient/list-patient';


/* eslint-disable-next-line */
export interface ViewProps {
}

export function View(props: ViewProps) {
  const [value, setValue] = React.useState('1');
  const [toggle, setToggle]=useState(1);
  const navigate=useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className={styles['viewcontainer']}>
      <TabContext value={value} >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className={styles['tabnav']}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Details" value="1"/>
            <Tab label="Doctors" value="2" />
            {/* <Tab label="Patients" value="3" /> */}
            {/* <Tab label="Patients" value="3" /> */}
          </TabList>
        </Box>
        <TabPanel value="1"><HospitalView/></TabPanel>
        <TabPanel value="2"><ListDoctors /></TabPanel>
        {/* <TabPanel value="3"><ListPatients /></TabPanel> */}
        {/* <TabPanel value="3"><PatientsList /></TabPanel> */}
      </TabContext>
    </div>
  );
}

export default View;
