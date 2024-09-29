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
    try {
      const response = await axios.get(
        `${apiUrl}/medical-history/${patient?.id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data) {
        setMedicalHistory(response.data);
        console.log('Medical history:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch medical history:', error);
    }
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
          width: '100%',
        }}
      >
        <h3 style={{ margin: '0', fontFamily: 'Inter, sans-serif' }}>
          Medical History
        </h3>
      </Box>

      <Card
        style={{
          width: '100%',
          height: '100%',
          marginRight: '20px',
        }}
      >
        <Timeline
          sx={{
            minHeight: 'fit-content',
            padding: 0,
            '& .MuiTimelineItem-root::before': {
              content: '""',
              flex: 0,
              padding: 0,
              marginLeft: '5%',
            },
          }}
        >
          {medicalHistory?.groupedData?.length ? (
            medicalHistory.groupedData
              .sort((a, b) => b.diagnosisDetails.id - a.diagnosisDetails.id)
              .slice(0, 3)
              .map((item) => (
                <TimelineItem
                  key={item.diagnosisDetails.id}
                  position="right"
                  sx={{ minHeight: 'fit-content', padding: 0 }}
                >
                  <TimelineSeparator sx={{ marginRight: '3%' }}>
                    <TimelineDot sx={{ backgroundColor: '#064B4F' }} />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <Box sx={{ width: '85%' }}>
                    <Typography color="textSecondary" sx={{ marginBottom: 1 }}>
                      Date: {formatDate(item.diagnosisDate)}
                    </Typography>
                    <Card
                      style={{
                        border: '1px solid #064B4F',
                        marginBottom: 2,
                        width: '100%',
                        alignContent: 'flex-start',
                      }}
                    >
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
                          Height: {item.diagnosisDetails.height} cm, Weight:{' '}
                          {item.diagnosisDetails.weight} kg, Pulse:{' '}
                          {item.diagnosisDetails.pulse} bpm
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
                          {item.diagnosisDetails.details}
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
                          {item.diagnosisDetails.chiefComplaints.join(', ')}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </TimelineItem>
              ))
          ) : (
            <TimelineItem position="left">
              <TimelineSeparator>
                <TimelineDot sx={{ backgroundColor: '#064B4F' }} />
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

        {medicalHistory?.groupedData?.length > 3 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 2,
            }}
          >
            <Button
              component={Link}
              to={`/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patients/${params.patientId}/medical-history`}
              variant="contained"
              color="primary"
              sx={{ textDecoration: 'none', marginBottom: 2 }}
            >
              View All History
            </Button>
          </Box>
        )}
      </Card>
    </div>
  );
}

export default ViewMedicalHistoryTimeline;