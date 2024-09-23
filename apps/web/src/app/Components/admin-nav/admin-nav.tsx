import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import styles from './admin-nav.module.scss';
import { Link, useParams } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import { useContext, useState } from 'react';
import HospitalContext from '../../contexts/hospital-context';
import digimedic from "../../../assets/digimedic.png";
import UserContext from '../../contexts/user-context';


/* eslint-disable-next-line */
export interface AdminNavProps {}

export function AdminNav(props: AdminNavProps) {
  const [selectedComponent, setSelectedComponent] = useState("dashboard");

  const handleComponentChange = (componentName: any) => {
    setSelectedComponent(componentName);
  };

  const hospitalcontext=useContext(HospitalContext);
  const usercontext=useContext(UserContext);


  return (
    <div className={styles['container']}>
     <Drawer
        sx={{
          '& .MuiDrawer-paper': {
            width: '225px',
            boxSizing: 'border-box',
            // marginTop: '64px',
            backgroundColor: '#FFFFFF',
            color: "black"
          },
          '@media (max-width: 600px)': {
            '& .MuiDrawer-paper': {
              width: '48px',
            },
          },
        }}
        variant="permanent"
        anchor="left"
        className={styles['side-drawer']}
      >

        {/* <Toolbar sx={{height:"59px"}}><img src={POYV} alt="POYV logo" width="150px" height="23px"/></Toolbar> */}
        <Toolbar sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}><img src={digimedic} alt="medi plus logo" width="165px" height="60px" /></Toolbar>
        {/* <Divider /> */}


        {/* doctor admin nav */}
        {/* {(!doctorContext?.doctor) ? */}
         <List sx={{ mt: "30px", mr: "10px", ml:"10px" }} className={styles['Nav']}>
          <Link style={{ textDecoration: "none" }} to={`/hospitals/${hospitalcontext?.hospital?.id}/admin/${usercontext?.user?.id}`} onClick={() => handleComponentChange('dashboard')}>
          <ListItemButton className={`${styles['button-tabs']} ${selectedComponent === 'dashboard' && styles['active-tab']
            }`}>
            <ListItemIcon>
              <div className={styles['icon-bg']}>
              <DashboardIcon className={styles['drawer-icons']} />
              </div>
            </ListItemIcon>
            <ListItemText className={styles["drawertab"]} primary="Dashboard" />
          </ListItemButton>
        </Link>
          <Link style={{ textDecoration: "none" }} to={`/hospitals/${hospitalcontext?.hospital?.id}/admin/${usercontext?.user?.id}/doctors`} onClick={() => handleComponentChange('doctors')}>
            <ListItemButton className={`${styles['button-tabs']} ${selectedComponent === 'doctors' && styles['active-tab']
              }`}>
              <ListItemIcon>
                <MedicalServicesOutlinedIcon className={styles['drawer-icons']} />
              </ListItemIcon> 
              <ListItemText className={styles["drawertab"]} primary="Doctors" />
            </ListItemButton>
          </Link> 
          <Link style={{ textDecoration: "none" }} to={`/hospitals/${hospitalcontext?.hospital?.id}/admin/${usercontext?.user?.id}/patients`} onClick={() => handleComponentChange('patients')}>
            <ListItemButton className={`${styles['button-tabs']} ${selectedComponent === 'patients' && styles['active-tab']
              }`}>
              <ListItemIcon>
                <MedicalServicesOutlinedIcon className={styles['drawer-icons']} />
              </ListItemIcon> 
              <ListItemText className={styles["drawertab"]} primary="Patients" />
            </ListItemButton>
          </Link> 
          <Link style={{ textDecoration: "none" }} to={`/hospitals/${hospitalcontext?.hospital?.id}/admin/${usercontext?.user?.id}/appointments`} onClick={() => handleComponentChange('appointments')}>
            <ListItemButton className={`${styles['button-tabs']} ${selectedComponent === 'appointments' && styles['active-tab']
              }`}>
              <ListItemIcon>
                <MedicalServicesOutlinedIcon className={styles['drawer-icons']} />
              </ListItemIcon> 
              <ListItemText className={styles["drawertab"]} primary="Appointments" />
            </ListItemButton>
          </Link> 
          </List>
      </Drawer>
    </div>
  );
}

export default AdminNav;
