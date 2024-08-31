import { Avatar, Box, Stack } from '@mui/material';
import styles from './all-appointment-log.module.scss';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

/* eslint-disable-next-line */
export interface AllAppointmentLogProps { }

// Define the structure for dummy appointment log data
interface AppointmentLog {
  id: number;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  status: string;
}

export function AllAppointmentLog(props: AllAppointmentLogProps) {
  // Dummy data for appointment logs
  const dummyAppointmentLogs: AppointmentLog[] = [
    {
      id: 1,
      patientName: 'John Doe',
      doctorName: 'Dr. Smith',
      appointmentDate: '2024-09-01 10:00 AM',
      status: 'Completed',
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      doctorName: 'Dr. Adams',
      appointmentDate: '2024-09-01 11:30 AM',
      status: 'Pending',
    },
    // More dummy data...
  ];

  return (
    <div className={styles['container']} style={{ width: '560px', borderRadius: '5px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'}}>
      <Box 
      >
        <h2 style={{ marginLeft: '20px', color: '#2B3674' }}>Upcoming Appointmets</h2>
        {dummyAppointmentLogs.map((log) => (
          <Card
            key={log.id}
            className={styles['log-card']}
            sx={{
              display: 'flex',
              width: '100',
              height:'10',
              border: '5px solid #EBFAF9',
              borderRadius: 5,
              margin: 2,
              backgroundColor: '#EBFAF9',

            }}
          >
            <CardContent sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex' }}>
                <Stack direction="row" spacing={2}>
                  <Avatar alt="nhnthn" src="/static/images/avatar/1.jpg" />
                </Stack>
                <Typography
                  variant="h6"
                  component="div"
                  className={styles['log-title']}
                  sx={{ color: '#2B3674', ml: '50px' }}
                >
                  {log.patientName}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  marginTop:'5px',
                  backgroundColor:'#E6F2FD',
                  display: 'flex',
                  alignContent: 'auto',
                  justifyContent: 'space-between'
                }}
                color="text.secondary"
                className={styles['log-details']}
              >
                {(() => {
                  const date = new Date(log.appointmentDate);
                  const formattedDate = date.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'short' }).toUpperCase();
                  const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });

                  return (
                    <>
                      <CalendarMonthOutlinedIcon sx={{color:'#2B3674'}}></CalendarMonthOutlinedIcon>  {formattedDate} | <AccessTimeIcon sx={{color:'#2B3674'}}></AccessTimeIcon>  {formattedTime}
                    </>
                  );
                })()}
              </Typography>
              <Typography variant="body2" color="text.secondary" className={styles['log-details']}>
                Status: {log.status}
              </Typography>
            </CardContent>
          </Card>
        ))}

      </Box>

    </div>
  );
}

export default AllAppointmentLog;
