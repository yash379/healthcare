import styles from './drawer-component.module.scss';
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
import { useContext, useState } from 'react';
// import Home from '../../pages/home/home';
import { Link, useParams } from 'react-router-dom';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import barrier from '../../../assets/parking_1057371.png';
import fountlab from "../../../assets/fount-lab-logo.png"
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { HospitalContext } from '../../contexts/user-context';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';

/* eslint-disable-next-line */
export interface DrawerComponentProps { };

const drawerWidth = 200;

export function DrawerComponent(props: DrawerComponentProps) {
  // const [menudata, setMenudata] = useState("home")
  const [selectedComponent, setSelectedComponent] = useState("dashboard");

  const handleComponentChange = (componentName: any) => {
    setSelectedComponent(componentName);
  };
  const { id } = useParams();

  const hospitalcontext = useContext(HospitalContext);
  console.log("hospital context:", hospitalcontext);
  console.log("hospital id:", hospitalcontext?.id);


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
        {/* <Divider /> */}
        <List sx={{ mt: "100px" }} className={styles['Nav']}>

          <Link style={{ textDecoration: "none" }} to={`/dashboard/${hospitalcontext?.id}`} onClick={() => handleComponentChange('dashboard')}>
            <ListItemButton className={`${styles['button-tabs']} ${selectedComponent === 'dashboard' && styles['active-tab']
              }`}>
              <ListItemIcon>
                <DashboardIcon className={styles['drawer-icons']} />
              </ListItemIcon>
              <ListItemText className={styles["drawertab"]} primary="Dashboard" />
            </ListItemButton>
          </Link>
          <Link style={{ textDecoration: "none" }} to={`/hospital/${hospitalcontext?.id}/appointments`} onClick={() => handleComponentChange('appointments')}>
            <ListItemButton className={`${styles['button-tabs']} ${selectedComponent === 'appointments' && styles['active-tab']
              }`}>
              <ListItemIcon>
                <AssignmentIcon className={styles['drawer-icons']} />
              </ListItemIcon>
              <ListItemText className={styles["drawertab"]} primary="Appointment" />
            </ListItemButton>
          </Link>

          <Link style={{ textDecoration: "none" }} to={`/hospital/${hospitalcontext?.id}/doctors`} onClick={() => handleComponentChange('doctors')}>
            <ListItemButton className={`${styles['button-tabs']} ${selectedComponent === 'doctors' && styles['active-tab']
              }`}>
              <ListItemIcon>
                <MedicalServicesIcon className={styles['drawer-icons']} />
              </ListItemIcon>
              <ListItemText className={styles["drawertab"]} primary="Doctor" />
            </ListItemButton>
          </Link>
          <Link style={{ textDecoration: "none" }} to={`/hospital/${hospitalcontext?.id}/patients`} onClick={() => handleComponentChange('patients')}>
            <ListItemButton className={`${styles['button-tabs']} ${selectedComponent === 'patients' && styles['active-tab']
              }`}>
              <ListItemIcon >
                <GroupIcon className={styles['drawer-icons']} />
              </ListItemIcon>
              <ListItemText className={styles["drawertab"]} primary="Patient" />
            </ListItemButton>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/reports" onClick={() => handleComponentChange('reports')}>
            <ListItemButton className={`${styles['button-tabs']} ${selectedComponent === 'reports' && styles['active-tab']
              }`}>
              <ListItemIcon >
                <AssessmentIcon className={styles['drawer-icons']} />
              </ListItemIcon>
              <ListItemText className={styles["drawertab"]} primary="Report" />
            </ListItemButton>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/settings" onClick={() => handleComponentChange('settings')}>
            <ListItemButton className={`${styles['button-tabs']} ${selectedComponent === 'settings' && styles['active-tab']
              }`}>
              <ListItemIcon >
                <SettingsIcon className={styles['drawer-icons']} />
              </ListItemIcon>
              <ListItemText className={styles["drawertab"]} primary="Setting" />
            </ListItemButton>
          </Link>

        </List>
      </Drawer>
    </div>
  );
}

export default DrawerComponent;





