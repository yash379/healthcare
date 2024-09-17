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
import mediPlus from '../../../assets/DigiMedic_logo.svg';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { IconHome } from '@tabler/icons-react';
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
/* eslint-disable-next-line */
export interface DrawerComponentProps {}

const drawerWidth = 250;

export function DrawerComponent(props: DrawerComponentProps) {
  const location = useLocation();
  const path = location.pathname.split('/')[1];
  console.log(path);

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
            width: drawerWidth,
            boxSizing: 'border-box',
            // marginTop:'64px',
            backgroundColor: '#FFFFFF',
            color: 'black',
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
        <Toolbar
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src={mediPlus}
            alt="medi plus logo"
            width="120px"
            height="60px"
          />
        </Toolbar>
        {/* <Divider className={styles['logo-divider']}/> */}
        <List sx={{ mr: '15px', ml: '15px' }}>
          <Link
            style={{ textDecoration: 'none' }}
            to={`/dashboard`}
            onClick={() => handleComponentChange('dashboard')}
          >
            <ListItem>
              <ListItemButton
                sx={{ padding: '10px 20px' }}
                className={`${styles['button-tabs']} ${
                  selectedComponent === 'dashboard' && styles['active-tab']
                }`}
              >
                <ListItemIcon sx={{ minWidth: '100px' }}>
                  <SpaceDashboardOutlinedIcon className={styles['drawer-icons']} />
                </ListItemIcon>
                <ListItemText
                  primary="Dashboard"
                  className={styles['drawertab']}
                ></ListItemText>

                {/* <ListItemText  className={styles["drawertab"]} primary="Dashboard" /> */}
              </ListItemButton>
            </ListItem>
          </Link>
          <Link
            style={{ textDecoration: 'none' }}
            to={`/hospitals`}
            onClick={() => handleComponentChange('hospitals')}
          >
            <ListItem>
              <ListItemButton
                sx={{ padding: '10px 20px' }}
                className={`${styles['button-tabs']} ${
                  selectedComponent === 'hospitals' && styles['active-tab']
                }`}
              >
                <ListItemIcon sx={{ minWidth: '100px' }}>
                  <CorporateFareOutlinedIcon
                    className={styles['drawer-icons']}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Hospitals"
                  // sx={{ paddingLeft: '50px' }}
                  className={styles['drawertab']}
                ></ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>
          <Link
            style={{ textDecoration: 'none' }}
            to={`/users`}
            onClick={() => handleComponentChange('users')}
          >
            <ListItem>
              <ListItemButton
                sx={{ padding: '10px 20px' }}
                className={`${styles['button-tabs']} ${
                  selectedComponent === 'users' && styles['active-tab']
                }`}
              >
                <ListItemIcon sx={{ minWidth: '100px' }}>
                  <PeopleOutlineIcon className={styles['drawer-icons']} />
                </ListItemIcon>
                <ListItemText
                  primary="Users"
                  className={styles['drawertab']}
                ></ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>
          <Link
            style={{ textDecoration: 'none' }}
            to={`/cancer-detection`}
            onClick={() => handleComponentChange('Prediction Model')}
           >
            <ListItem>
              <ListItemButton
                sx={{ padding: '10px 20px' }}
                className={`${styles['button-tabs']} ${
                  selectedComponent === 'Prediction Model' && styles['active-tab']
                }`}
              >
                <ListItemIcon sx={{ minWidth: '100px' }}>
                  <AssignmentOutlinedIcon
                    className={styles['drawer-icons']}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Prediction Model"
                  className={styles['drawertab']}
                ></ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>
          <Link
            style={{ textDecoration: 'none' }}
            to={`/saransh-ai`}
            onClick={() => handleComponentChange('AI Summarizer')}
           >
            <ListItem>
              <ListItemButton
                sx={{ padding: '10px 20px' }}
                className={`${styles['button-tabs']} ${
                  selectedComponent === 'AI Summarizer' && styles['active-tab']
                }`}
              >
                <ListItemIcon sx={{ minWidth: '100px' }}>
                  <AutoAwesomeOutlinedIcon
                    className={styles['drawer-icons']}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="AI Summarizer"
                  className={styles['drawertab']}
                ></ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
      </Drawer>
    </div>
  );
}

export default DrawerComponent;

function useRouteMatch(arg0: string) {
  throw new Error('Function not implemented.');
}
