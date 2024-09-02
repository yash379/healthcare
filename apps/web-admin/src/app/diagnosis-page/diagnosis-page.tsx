import { Avatar, Box, Divider, Grid, Paper, TextField, Typography } from '@mui/material';
import styles from './diagnosis-page.module.scss';
import { Pages } from '@mui/icons-material';
import { Gender } from '@prisma/client';
import { StatusEnum } from '../pages/list-appointment/list-appointment';
import { pink } from '@mui/material/colors';


interface ViewAppointment {
  id: number;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  gender: string; // Adjust if using Gender enum
  status: string; // Adjust if using StatusEnum
  age: number;
  date: Date;
}
const dummyAppointments: ViewAppointment[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    mobileNumber: '1234567890',
    email: 'john.doe@example.com',
    gender: Gender.MALE,
    status: StatusEnum.InProgress,
    age: 30,
    date: new Date(),
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    mobileNumber: '0987654321',
    email: 'jane.smith@example.com',
    gender: Gender.FEMALE,
    status: StatusEnum.InProgress,
    age: 25,
    date: new Date(),
  },
  // More dummy data...
];

/* eslint-disable-next-line */
export interface DiagnosisPageProps { }

export function DiagnosisPage(props: DiagnosisPageProps) {
  return (
    <Box className={styles['container']}  >
      <Paper sx={{ padding: 3, width: '100', marginRight: '30px', backgroundColor: '#f8f9fa', borderRadius: 2, boxShadow: 3 }}>
        <Box>
          <Box sx={{ display: 'flex' }}>
            <Avatar>JS</Avatar>
            <Box sx={{ marginLeft: '10px' }}>
              <Typography sx={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 'bold' }} >Mr.Jane Smith</Typography>
              <Box sx={{ display: 'flex' }} >
                <Typography>32y |</Typography>
                <Typography sx={{ marginLeft: '3px', fontFamily: 'DM Sans, sans-serif', fontWeight: 'light' }} >Male |</Typography>
                <Typography sx={{ marginLeft: '3px', fontFamily: 'DM Sans, sans-serif', fontWeight: 'light' }} >899991111</Typography>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ color: '#EBFAF9', height: '10px' }} />
          <Box sx={{ marginTop: '10px' }}>
            <Typography sx={{ color: '#064B4F', fontFamily: 'DM Sans, sans-serif' }} >Feb 10,2022 by Dr.Dilip Cgandra </Typography>
            {/* <Typography>by</Typography>
            <Typography sx={{color:'#064B4F'}}>Dr.Dilip Cgandra</Typography> */}
          </Box>
          <Divider sx={{ color: '#EBFAF9', height: '10px' }} />
          <Box sx={{ marginTop: '10px', fontFamily: 'DM Sans, sans-serif', fontWeight: 'Bold', fontSize: '25px', color: '#2B3674' }}>
            Vitals
          </Box>


          <Box sx={{ marginTop: '5px' }}>
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 'Bold', fontSize: '25px' }}>Height(cm)</Typography>
                <TextField
                  type="text"
                  sx={{
                    width: '15rem',
                    marginBottom: 1,
                    marginLeft: '10px'
                  }}
                  className="form-control"
                  placeholder="Enter "
                  label="Height"

                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '4%' }}>
                <Typography sx={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 'Bold', fontSize: '25px' }}>Weight (Kg)</Typography>
                <TextField
                  type="text"
                  sx={{
                    width: '15rem',
                    marginBottom: 1,
                    marginLeft: '10px'
                  }}
                  className="form-control"
                  placeholder="Enter "
                  label="Height"

                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 'Bold', fontSize: '25px' }}>SpO2 (%)</Typography>
                <TextField
                  type="text"
                  sx={{
                    width: '15rem',
                    marginBottom: 1,
                    marginLeft: '10px'
                  }}
                  className="form-control"
                  placeholder="Enter "
                  label="Height"

                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '10%' }}>
                <Typography sx={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 'Bold', fontSize: '25px' }}>BMI Kg/hr</Typography>
                <TextField
                  type="text"
                  sx={{
                    width: '15rem',
                    marginBottom: 1,
                    marginLeft: '10px'
                  }}
                  className="form-control"
                  placeholder="Enter "
                  label="Height"

                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 'Bold', fontSize: '25px' }}>Pulse (bmp)</Typography>
                <TextField
                  type="text"
                  sx={{
                    width: '15rem',
                    marginBottom: 1,
                    marginLeft: '10px'
                  }}
                  className="form-control"
                  placeholder="Enter "
                  label="Height"

                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '10%' }}>
                <Typography sx={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 'Bold', fontSize: '25px' }}>Temperature (F)</Typography>
                <TextField
                  type="text"
                  sx={{
                    width: '15rem',
                    marginBottom: 1,
                    marginLeft: '10px'
                  }}
                  className="form-control"
                  placeholder="Enter "
                  label="Height"

                />
              </Box>
            </Box>


          </Box>

        </Box>

      </Paper>
    </Box>
  );
}

export default DiagnosisPage;
