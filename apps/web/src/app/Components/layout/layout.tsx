import { useContext, useEffect } from 'react';
import TopBar from '../app-bar/app-bar';
import DrawerComponent from '../drawer-component/drawer-component';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './layout.module.scss';
import { Box, CircularProgress } from '@mui/material';
import { User, ViewUser } from '@healthcare/data-transfer-types';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { HospitalContext } from '../../contexts/hospital-context';
import DoctorContext from '../../contexts/doctor-context';
import UserContext from '../../contexts/user-context';

/* eslint-disable-next-line */
export interface LayoutProps {
  user: User | null;
}

export function Layout({ user }: LayoutProps) {
  const apiUrl = environment.apiUrl;
  const hospitalContext = useContext(HospitalContext);
  const navigate = useNavigate();

  const doctorContext=useContext(DoctorContext);
  const usercontext=useContext(UserContext);

  useEffect(() => {
    if (user == null) {
      navigate('/login');
      console.log('User not logged in');
    }
  }, [navigate, user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loginResponse = await axios.get(`${apiUrl}/profile`, {
          withCredentials: true,
        });
        console.log('Login user', loginResponse.data);
        // navigate(`/dashboard/${hsopitalContext?.hospital?.id}`);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [apiUrl, navigate, ]);
  

  useEffect(()=>{
    usercontext?.setUser(user);
  },[apiUrl]);

  return (
    <div className={styles['container']}>
      {/* {user == null ? (
        <Box>
          <CircularProgress />
        </Box>
      ) : (
        <UserContext.Provider value={user}> */}
          <TopBar />
          <DrawerComponent />
          <div className={styles['outlet']}>
            <Box className={styles['Box']}>
              <Outlet />
            </Box>
          </div>
        {/* </UserContext.Provider>
      )} */}
    </div>
  );
}

export default Layout;
