import React, { useState } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import styles from './view-medical-history-timeline.module.scss';
import { Box, Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

/* eslint-disable-next-line */
export interface ViewMedicalHistoryTimelineProps { }

export function ViewMedicalHistoryTimeline(
  props: ViewMedicalHistoryTimelineProps
) {
  // Dummy data for appointments
  const [dummyAppointments, setDummyAppointments] = useState([
    {
      id: 1,
      duration: '3 months',
      status: 'InProgress',
      age: 30,
      date: new Date('2024-09-01'),
      description: 'Diabetes Control Appointment',
      details: 'Blood sugar management is especially important for people with diabetes, as chronically high blood sugar levels can lead to complications.',
      document: 'View Prescription'
    },
    {
      id: 2,
      duration: '3 months',
      status: 'InProgress',
      age: 30,
      date: new Date('2024-09-01'),
      description: 'Diabetes Control Appointment',
      details: 'Blood sugar management is especially important for people with diabetes, as chronically high blood sugar levels can lead to complications.',
      document: 'View Prescription'

    },
  ]);

  return (
    <div className={styles['container']} >
      <Box sx={{ display: 'flex', justifyContent: "flex-end", alignItems: 'center' }}>
        <h1>Medical History</h1>
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <Button variant="contained" color="primary"
            sx={{
              marginTop: 2,
              marginLeft: 2,

              fontFamily: 'Poppins, sans-serif', // Use Poppins font
              backgroundColor: '#064B4F',
              padding: '25px 30px', // Increase padding for larger button
              fontSize: '17px', // Increase font size
              width: 'fit-content', // Optional: adjust width if needed
            }}>
            Generate Summary
          </Button>
          <Button
            sx={{
              marginTop: 2,
              marginLeft: 2,
              color: "#064B4F",
              fontWeight: 'bold',
              border: '2px solid #064B4F',
              fontFamily: 'Poppins, sans-serif', // Use Poppins font
              // backgroundColor: '#064B4F',
              padding: '25px 45px', // Increase padding for larger button
              fontSize: '17px', // Increase font size
              // border:'#064B4F',
              width: 'fit-content', // Optional: adjust width if needed
            }}>
              <PrintIcon sx={{marginRight:1}}></PrintIcon>
            Print
          </Button>
        </Box>
      </Box>
      <Timeline
        sx={{
          // [`& .${timelineItemClasses.root}:before`]: {
          //   flex: 0,
          //   padding: 0,
          // },
        }}
      >
        {dummyAppointments.map((appointment) => (
          <TimelineItem key={appointment.id}>
            <TimelineSeparator >
              <TimelineDot sx={{ backgroundColor: '#064B4F' }} />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              {/* Display date outside the card */}
              <Typography color="textSecondary" sx={{ marginBottom: 1 }}>
                {appointment.date.toDateString()}
              </Typography>
              {/* Card with appointment details */}
              <Card sx={{
                width: '100%',
                marginBottom: 2,
                backgroundColor: 'rgba(6, 75, 79, 0.55)', // 55% opacity
                fontFamily: 'Poppins, sans-serif',
              }}>
                <CardContent>
                  <Typography variant="h5" color="#000000">
                    {appointment.description}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#454C73', marginBottom: 2, fontFamily: 'Poppins, sans-serif', mt: 2 }}>
                    {appointment.details}
                  </Typography>
                  <Divider sx={{ marginY: 1, backgroundColor: '#F4F6FA' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <Typography variant="body2" color="white">
                        Duration:
                      </Typography>
                      <Typography variant="body2" color="white">
                        {appointment.duration}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="body2" color="white">
                        Status:
                      </Typography>
                      <Typography variant="body2" color="white">
                        {appointment.status}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="body2" color="white">
                        Document:
                      </Typography>
                      <Typography variant="body2" color="white">
                        {appointment.document}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TimelineContent>

          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}

export default ViewMedicalHistoryTimeline;
