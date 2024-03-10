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
import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import BikeScooterIcon from '@mui/icons-material/BikeScooter';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import mediPlus from "../../../assets/Mediplus.png"
import DashboardIcon from '@mui/icons-material/Dashboard';


/* eslint-disable-next-line */
export interface DrawerComponentProps { };


const drawerWidth = 200;

export function DrawerComponent(props: DrawerComponentProps) {
  const location = useLocation();
  const path = location.pathname.split('/')[1];
  console.log(path)

  
  const [selectedComponent, setSelectedComponent] = useState(`${path}`);

  const handleComponentChange = (componentName: any) => {
    setSelectedComponent(componentName);
  };

  const { id } = useParams();
  // console.log(id);
  return (
    <div>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: "225px",
            boxSizing: 'border-box',
            // marginTop:'64px',
            backgroundColor: '#FFFFFF',
            color: "black"
          },
          '@media (max-width: 768px)': {
            '& .MuiDrawer-paper': {
              width: '48px',
            },
          },
        }}
        variant="permanent"
        anchor="left"
        className={styles['side-drawer']}
      >
        <Toolbar sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}><img src={mediPlus} alt="medi plus logo" width="100px" height="38px" /></Toolbar>
        {/* <Divider className={styles['logo-divider']}/> */}
        <List sx={{ mt: "30px", mr: "10px", ml: "10px" }} className={styles['Nav']}>
          <Link style={{ textDecoration: "none" }} to={`/dashboard`} onClick={() => handleComponentChange('dashboard')}>
            <ListItemButton className={`${styles['button-tabs']} ${selectedComponent === 'dashboard' && styles['active-tab']
              }`}>
              <ListItem>
                <DashboardIcon className={styles['drawer-icons']} />
              </ListItem>
              <ListItemText sx={{ml:"-100px"}} className={styles["drawertab"]} primary="Dashboard" />
            </ListItemButton>
          </Link>
          <Link style={{ textDecoration: "none" }} to={`/hospitals`} onClick={() => handleComponentChange('hospitals')}>
            <ListItemButton className={`${styles['button-tabs']} ${selectedComponent === 'hospitals' && styles['active-tab']
              }`} >
              <ListItem>
                <MapsHomeWorkIcon className={styles['drawer-icons']} />
              </ListItem>
              <ListItem sx={{ paddingRight: "21px" }} className={styles["drawertab"]}>Hospitals</ListItem>
            </ListItemButton>
          </Link>
          {/* <Link style={{ textDecoration: "none" }} to={`/vehicles`} onClick={() => handleComponentChange('vehicles')}>
            <ListItemButton  className={`${styles['button-tabs']} ${
                selectedComponent === 'vehicles' && styles['active-tab']
              }`}>
              <ListItem >
                <BikeScooterIcon  className={styles['drawer-icons']}/>
              </ListItem>
                <ListItem sx={{paddingRight:"32px"}} className={styles["drawertab"]}>Vehicles</ListItem>
            </ListItemButton>
          </Link> */}
          <Link style={{ textDecoration: "none" }} to={`/users`} onClick={() => handleComponentChange('users')}>
            <ListItemButton className={`${styles['button-tabs']} ${selectedComponent === 'users' && styles['active-tab']
              }`}>
              <ListItem >
                <PeopleOutlineIcon className={styles['drawer-icons']} />
              </ListItem>
              <ListItem sx={{ paddingRight: "21px" }} className={styles["drawertab"]}>Users</ListItem>
            </ListItemButton>
          </Link>
          {/* <ListItemButton className={styles['button-tabs']}>
            <ListItem >
              <DeviceHubIcon className={styles['drawer-icons']}/>
            </ListItem>
            <Link style={{ textDecoration: "none" }} to={`/vehicles`}>
              <ListItem className={styles["drawertab"]}>Vehicles</ListItem>
            </Link>
          </ListItemButton> */}
          <Box component="main">
          </Box>
        </List>
      </Drawer>
    </div>
  );
}

export default DrawerComponent;





function useRouteMatch(arg0: string) {
  throw new Error('Function not implemented.');
}

