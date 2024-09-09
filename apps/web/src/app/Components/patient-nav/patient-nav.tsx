import styles from './patient-nav.module.scss';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import GroupsIcon from '@mui/icons-material/Groups';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { Box } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
// import Home from '../../pages/home/home';
import { Link, useParams } from 'react-router-dom';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import barrier from '../../../assets/parking_1057371.png';
import fountlab from "../../../assets/fount-lab-logo.png"
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { HospitalContext } from '../../contexts/hospital-context';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import mediPlus from "../../../assets/Mediplus.png";
import digimedic from "../../../assets/digimedic.png";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DoctorContext from '../../contexts/doctor-context';
import PatientContext from '../../contexts/patient-context';


/* eslint-disable-next-line */
export interface PatientNavProps {}

const drawerWidth = 200;

export function PatientNav(props: PatientNavProps) {
 // const [menudata, setMenudata] = useState("home")
 const [selectedComponent, setSelectedComponent] = useState("dashboard");

 const handleComponentChange = (componentName: any) => {
   setSelectedComponent(componentName);
 };
 const { id } = useParams();

 const hospitalcontext = useContext(HospitalContext);
 console.log("hospital context:", hospitalcontext);
 console.log("hospital id:", hospitalcontext?.hospital?.id);

 const doctorContext=useContext(DoctorContext);
 const patientcontext=useContext(PatientContext);

 console.log("patients context:", patientcontext);
 console.log("doctor context:", doctorContext);

 const params=useParams();

 return (
   <div>
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

       {/* <Toolbar sx={{height:"59px"}}><img src={fountlab} alt="font lab logo" width="150px" height="23px"/></Toolbar> */}
       <Toolbar sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}><img src={digimedic} alt="medi plus logo" width="165px" height="60px" /></Toolbar>
       {/* <Divider /> */}


       (<List sx={{ mt: "30px", mr: "10px", ml:"10px" }} className={styles['Nav']}>

         <Link style={{ textDecoration: "none" }} to={`/hospitals/${hospitalcontext?.hospital?.id}/patients/${patientcontext?.patient?.id}/dashboard`} onClick={() => handleComponentChange('dashboard')}>
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
         <Link style={{ textDecoration: "none" }} to={`/hospitals/${hospitalcontext?.hospital?.id}/patients/${patientcontext?.patient?.id}/appointments`} onClick={() => handleComponentChange('appointments')}>
           <ListItemButton className={`${styles['button-tabs']} ${selectedComponent === 'appointments' && styles['active-tab']
             }`}>
             <ListItemIcon>
               <AssignmentOutlinedIcon className={styles['drawer-icons']} />
             </ListItemIcon>
             <ListItemText className={styles["drawertab"]} primary="Appointment" />
           </ListItemButton>
         </Link>
         <Link style={{ textDecoration: "none" }} to="/reports" onClick={() => handleComponentChange('reports')}>
           <ListItemButton className={`${styles['button-tabs']} ${selectedComponent === 'reports' && styles['active-tab']
             }`}>
             <ListItemIcon >
               <AssessmentOutlinedIcon className={styles['drawer-icons']} />
             </ListItemIcon>
             <ListItemText className={styles["drawertab"]} primary="Report" />
           </ListItemButton>
         </Link>
         <Link style={{ textDecoration: "none" }} to="/settings" onClick={() => handleComponentChange('settings')}>
           <ListItemButton className={`${styles['button-tabs']} ${selectedComponent === 'settings' && styles['active-tab']
             }`}>
             <ListItemIcon >
               <SettingsOutlinedIcon className={styles['drawer-icons']} />
             </ListItemIcon>
             <ListItemText className={styles["drawertab"]} primary="Setting" />
           </ListItemButton>
         </Link>
         <Link style={{ textDecoration: "none" }} to="/logout" onClick={() => handleComponentChange('logout')}>
           <ListItemButton className={`${styles['button-tabs']} ${selectedComponent === 'logout' && styles['active-tab']
             }`}>
             <ListItemIcon >
               <LogoutOutlinedIcon className={styles['drawer-icons']} />
             </ListItemIcon>
             <ListItemText className={styles["drawertab"]} primary="Logout" />
           </ListItemButton>
         </Link>

       </List>
       )
     </Drawer>
   </div>
 );
}

export default PatientNav;
