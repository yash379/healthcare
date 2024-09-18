import { Box, Card, CardContent, Typography } from '@mui/material';
import styles from './admin-dashboard.module.scss';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined';
import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import DoctorContext from '../../contexts/doctor-context';
import HospitalContext from '../../contexts/hospital-context';
import PatientContext from '../../contexts/patient-context';
import { Hospital } from '@healthcare/data-transfer-types';
import { environment } from '../../../environments/environment';
import UserContext from '../../contexts/user-context';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Link, useParams } from 'react-router-dom';

/* eslint-disable-next-line */
export interface AdminDashboardProps {}

interface HospitalDetails {
  id: string;
  isActive: boolean;
  // assetCount: assetCount[];
  name: string;
}

interface Manager {
  id: number;
  isPrimary: boolean;
  hospitalRole: {
    name: string;
  };
  user: {
    id: number;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
  };
}

export function AdminDashboard(props: AdminDashboardProps) {

  const [hospitaldata, setHospitalData] = useState<HospitalDetails[]>([]);
  const [hospitalId, setHospitalId] = useState<string>('');
  const [hospital, setHospital] = useState<Hospital>();
  const [adminData, setAdminData] = useState<Manager[]>([]);
  const [adminlength, setadminlength] = useState();
  const apiUrl = environment.apiUrl;


  const user = useContext(UserContext);

  const hospitalcontext = useContext(HospitalContext);
  console.log('hospital context:', hospitalcontext);
  console.log('hospital id:', hospitalcontext?.hospital?.id);

  const doctorContext=useContext(DoctorContext);
  const patientcontext=useContext(PatientContext);

  console.log("patients context:", patientcontext);
  console.log("doctor context:", doctorContext);

  // const countArray = Object.entries(count);
  // console.log(countArray);

  const getAllAdmin = async () => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(
        `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/managers`,
        {
          withCredentials: true,
        }
      );
      // console.log(response.data[0].user)
      const sortedDoctors = response.data.sort((a: any, b: any) => {
        if (a.isPrimary && !b.isPrimary) {
          return -1;
        } else if (!a.isPrimary && b.isPrimary) {
          return 1;
        } else {
          return 0;
        }
      });
      setAdminData(sortedDoctors);
      console.log('Admin Data', response.data);
      setadminlength(response.data.length);
    } catch (error) {
      console.error('Error fetching hospital data:', error);
    }
  };

  const getCount = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/asset-count`,
        {
          withCredentials: true,
        }
      );

      console.log('assestcount:', response.data.assestcount);
      console.log('hospitalid:', response.data.id);
      // setCount(response.data.assetcount);
      setHospitalData(response.data);
      setHospitalId(response.data.id);
    } catch (error) {
      console.log('Error in Fetching assetCount', error);
    }
  };
  console.log('Response Data of AssetCount:', hospitaldata);

  const getHospitaldetails = async () => {
    console.log('hospitalId:', hospitalId);
    try {
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(
        `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}`,
        {
          withCredentials: true,
        }
      );
      console.log('Hospital Details:', response.data);
      setHospital(response.data);
    } catch (error) {
      console.log('Error in fetching hospital details:', error);
    }
  };

  useEffect(() => {
    getCount();
  }, [user, hospitalcontext]);

  useEffect(() => {
    getHospitaldetails();
  }, [hospitalcontext]);

  useEffect(() => {
    getHospitaldetails();
  }, [user]);

  return (
    <div className={styles['container']}>
      <h1>Welcome to Admin Dashboard!</h1>
             <Card
                sx={{ minWidth: '40%', marginInline:'30px' }}
                className={styles['hospital-details']}
              >
                <CardContent>
                  <Typography variant="body2">
                    <div className={styles['soc-detail-add']}>
                      <LocalPhoneIcon sx={{ marginRight: '4px' }} />
                      {hospital?.phoneNumber}
                    </div>
                    <br />
                    <div className={styles['soc-detail-add']}>
                      <EmailIcon sx={{ marginRight: '4px' }} />
                      {hospital?.email}
                    </div>
                    <br />
                    <div className={styles['soc-detail-add']}>
                      <HomeIcon sx={{ marginRight: '4px' }} />
                      {hospital?.addressLine1}, {hospital?.addressLine2},{' '}
                      {hospital?.city}, {hospital?.stateCode},{' '}
                      {hospital?.countryCode}, {hospital?.postalCode}
                    </div>
                  </Typography>
                </CardContent>
              </Card>
            
              
             <Box sx={{display:'flex', flexWrap:'wrap', margin:'10px', gap:'6%'}}>
              <Card className={styles['cards']}>
                <CardContent className={styles['cardcontent']}>
                <Typography
                    variant="h4"
                    color="text.fourth"
                    gutterBottom
                    className={styles['fields-icons']}
                  >
                   <CurrencyRupeeOutlinedIcon sx={{p:"10px",color:"#3371EB", backgroundColor:"#EEF3FF"}} />
                  </Typography>
                  <Typography
                    variant="h4"
                    color="text.fourth"
                    gutterBottom
                    className={styles['fields']}
                  >
                    Earnings
                  </Typography>
                  <Typography className={styles['count']}>
                   23,425
                    <br />
                  </Typography>
                </CardContent>
              </Card>
              <Card className={styles['cards']}>
                <CardContent className={styles['cardcontent']}>
                <Typography
                    variant="h4"
                    color="text.fourth"
                    gutterBottom
                    className={styles['fields-icons']}
                  >
                   <PersonIcon sx={{p:"10px",color:"#FF8024", backgroundColor:"#FFF4F2"}} />
                  </Typography>
                  <Typography
                    variant="h4"
                    color="text.fourth"
                    gutterBottom
                    className={styles['fields']}
                  >
                    New Patient
                  </Typography>
                  <Typography className={styles['count']}>
                   1,925
                    <br />
                  </Typography>
                </CardContent>
              </Card>
              <Card className={styles['cards']}>
                <CardContent className={styles['cardcontent']}>
                <Typography
                    variant="h4"
                    color="text.fourth"
                    gutterBottom
                    className={styles['fields-icons']}
                  >
                   <AssignmentIcon sx={{p:"10px",color:"#14CC26", backgroundColor:"#EBFFE8"}} />
                  </Typography>
                  <Typography
                    variant="h4"
                    color="text.fourth"
                    gutterBottom
                    className={styles['fields']}
                  >
                    New Appointment
                  </Typography>
                  <Typography className={styles['count']}>
                   153
                    <br />
                  </Typography>
                </CardContent>
              </Card>
              <Card className={styles['cards']}>
                <CardContent className={styles['cardcontent']}>
                <Typography
                    variant="h4"
                    color="text.fourth"
                    gutterBottom
                    className={styles['fields-icons']}
                  >
                   <PeopleAltIcon sx={{p:"10px",color:"#9F0086", backgroundColor:"#FFE8FD"}} />
                  </Typography>
                  <Typography
                    variant="h4"
                    color="text.fourth"
                    gutterBottom
                    className={styles['fields']}
                  >
                    Patient Visit
                  </Typography>
                  <Typography className={styles['count']}>
                   20
                    <br />
                  </Typography>
                </CardContent>
              </Card> 
               {/* <div className={styles['dashboard-cards']}>
                 <Card className={styles['cards']}>
                      <CardContent className={styles['cardcontent']}>
                        <Typography variant="h6" color="text.secondary" gutterBottom className={styles['fields']}>
                          Managers
                        </Typography>
                        <Typography className={styles['count']}>
                          {adminlength}
                          <br />
                        </Typography>
                      </CardContent>
                  </Card>
              </div> */}
            </Box>
    </div>
  );
}

export default AdminDashboard;
