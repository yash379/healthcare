import React, { useContext, useEffect, useState } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Box, Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import axios from 'axios';
import { Patient } from '@healthcare/data-transfer-types';
import { environment } from '../../environments/environment';
import HospitalContext from '../contexts/hospital-context';
import PatientContext from '../contexts/patient-context';
import DoctorContext from '../contexts/doctor-context';
import { Link, useParams } from 'react-router-dom';

/* eslint-disable-next-line */
export interface ViewMedicalHistoryTimelineProps {
  patient: Patient | null;
}

interface DiagnosisDetails {
  id: number;
  details: string;
  height: number;
  weight: number;
  pulse: number;
  spo2: number;
  temperature: number;
  chiefComplaints: string[];
  doctorId: number;
  patientId: number;
  diagnosisDate: string;
  createdAt: string;
  updatedAt: string;
  medicalHistoryId: number;
}

interface Medicine {
  id: number;
  medicineName: string;
  instructions: string;
  dose: string;
  when: string;
  frequency: string;
  duration: string;
  prescriptionId: number;
}

interface Prescription {
  id: number;
  doctorId: number;
  patientId: number;
  prescriptionDate: string;
  createdAt: string;
  updatedAt: string;
  medicalHistoryId: number;
  medicines: Medicine[];
}

interface GroupedData {
  diagnosisDate: string;
  diagnosisDetails: DiagnosisDetails;
  relatedPrescriptions: Prescription[];
}

interface MedicalHistoryResponse {
  id: number;
  patientId: number;
  createdAt: string;
  updatedAt: string;
  groupedData: GroupedData[];
}

export function ViewMedicalHistoryTimeline({
  patient,
}: ViewMedicalHistoryTimelineProps) {
  const [medicalHistory, setMedicalHistory] =
    useState<MedicalHistoryResponse | null>(null);
  const apiUrl = environment.apiUrl;

  const hospitalcontext = useContext(HospitalContext);
  const doctorcontext = useContext(DoctorContext);
  const params = useParams();

  const getHistory = async () => {
    const response = await axios.get(
      `${apiUrl}/medical-history/${patient?.id}`,
      {
        withCredentials: true,
      }
    );
    setMedicalHistory(response.data);
    console.log('Medical history:', response.data);
  };

  useEffect(() => {
    if (patient) {
      getHistory();
    }
  }, [patient]);

  const formatDate = (isoDateString: string) => {
    return new Date(isoDateString).toLocaleDateString(); // Convert ISO string to local date format
  };

  return (
    <div>
      <Box
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
          width: '48%'
          
        }}
      >
        <h2 style={{ marginInline: '50px', fontFamily: 'Inter, sans-serif' }}>
          Medical History
        </h2>
        {/* <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" sx={{ padding: '12px 24px' }}>
            Generate Summary
          </Button>
          <Button variant="outlined" color="primary" sx={{ padding: '12px 24px' }}>
            <PrintIcon sx={{ marginRight: 1 }} /> Print
          </Button>
        </Box> */}
      </Box>
      <Card
      style={{
        width: '95%',
        marginLeft: '20px',
        height: '320px',
        marginRight: '20px',
      }}>    
      <Timeline
        sx={{
          position: 'initial',
          fontFamily: 'Inter, sans-serif',
          
        }}
      >
        {medicalHistory?.groupedData.length ? (
          medicalHistory.groupedData
            .sort((a, b) => b.diagnosisDetails.id - a.diagnosisDetails.id)
            .slice(0, 3)
            .map((item) => (
              <TimelineItem
                key={item.diagnosisDetails.id}
                position="right"
                sx={{ minHeight: 'fit-content'}}
              >
                <TimelineSeparator>
                  <TimelineDot sx={{ backgroundColor: '#064B4F' }} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography color="textSecondary" sx={{ marginBottom: 1 }}>
                    Date: {formatDate(item.diagnosisDate)}
                    {/* {item.diagnosisDetails.chiefComplaints.join(', ')} */}
                  </Typography>
                  
                  <Card
                    style={{
                      margin: '10px',
                      border: '1px solid #064B4F',
                      marginBottom: 2,
                      width: '480px',
                      alignContent: 'initial'

                    }}
                  >
                    {medicalHistory.groupedData.map((entry: GroupedData, index: number) => (
                   
                    <CardContent>
                    
                      <Typography
                        variant="subtitle1"
                        sx={{
                          padding: '8px',
                          borderRadius: '4px',
                          display: 'inline',
                          backgroundColor: '#e0f7fa',
                        }}
                      >
                        Vitals:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ display: 'inline', marginLeft: '4px' }}
                      >
                        Height: {entry.diagnosisDetails.height} cm, Weight:{' '}
                        {entry.diagnosisDetails.weight} kg, Pulse:{' '}
                        {entry.diagnosisDetails.pulse} bpm
                      </Typography>

                      <Divider sx={{ marginY: 2 }} />

                      <Typography
                        variant="subtitle1"
                        sx={{
                          backgroundColor: '#ffe6e6',
                          padding: '8px',
                          borderRadius: '4px',
                          display: 'inline',
                        }}
                      >
                        Diagnosis:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ padding: '8px', marginLeft: '4px' }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 'bold', display: 'inline' }}
                        >
                          Details:
                        </Typography>{' '}
                        {entry.diagnosisDetails.details}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ padding: '8px', marginLeft: '4px' }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 'bold', display: 'inline' }}
                        >
                          Chief Complaints:
                        </Typography>{' '}
                        {entry.diagnosisDetails.chiefComplaints.join(', ')}
                      </Typography>
                    </CardContent>
                  
                     ))}
                  </Card>
                 
                </TimelineContent>
              </TimelineItem>
            ))
        ) : (
          // Render a placeholder item if no diagnoses exist
          <TimelineItem position="right">
            <TimelineSeparator>
              <TimelineDot sx={{ backgroundColor: '#064B4F' }} />{' '}
              {/* Optional: Different color for 'No Data' */}
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Card sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="h6" color="textSecondary">
                    No Data Available
                  </Typography>
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        )}
      </Timeline>
      <div
        style={{
          display: 'flex',
          position: 'relative',
          justifyContent: 'end',
          marginTop: '-4px',
        }}
      >
        <Link
          to={`/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patients/${params.patientId}/medical-history`}
        >
          View More
        </Link>
      </div>
</Card>      

    </div>
  );
}

export default ViewMedicalHistoryTimeline;
