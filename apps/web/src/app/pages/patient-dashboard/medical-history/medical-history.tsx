import React, { useContext, useEffect, useState } from 'react';
import styles from './medical-history.module.scss';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Box,
  Tooltip,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import Summarizer from '../../ai-summarizer/ai-summarizer';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { environment } from '../../../../environments/environment';
import { Patient } from '@healthcare/data-transfer-types';
import HospitalContext from '../../../contexts/hospital-context';
import DoctorContext from '../../../contexts/doctor-context';
import PatientContext from '../../../contexts/patient-context';

/* eslint-disable-next-line */
export interface MedicalHistoryProps {
  patientId:string | undefined;
}

const dummyMedicalHistory = {
  patientName: 'Omkar Patil',
  history: [
    {
      date: '08/22/2023',
      vitals: {
        height: 175,
        weight: 72,
        pulse: 78,
        spo2: 98,
        bmi: 23.5,
        temperature: 36.7,
      },
      diagnosis: 'Flu and common cold',
      prescriptions: [
        {
          medicineName: 'Paracetamol',
          dose: '500mg',
          instructions: 'After meals',
          frequency: '1-1-1',
          duration: '5 days',
        },
        {
          medicineName: 'Cough Syrup',
          dose: '10ml',
          instructions: 'Before bed',
          frequency: '0-0-1',
          duration: '5 days',
        },
      ],
    },
    {
      date: '07/15/2023',
      vitals: {
        height: 175,
        weight: 70,
        pulse: 80,
        spo2: 97,
        bmi: 22.9,
        temperature: 37.0,
      },
      diagnosis: 'Mild Gastritis',
      prescriptions: [
        {
          medicineName: 'Antacid',
          dose: '1 tablet',
          instructions: 'Before meals',
          frequency: '1-0-1',
          duration: '7 days',
        },
      ],
    },
  ],
};

interface Medicine {
  medicineName: string;
  dose: string;
  instructions: string;
  frequency: string;
  duration: string;
}

interface DiagnosisDetails {
  height: number;
  weight: number;
  pulse: number;
  details: string;
  chiefComplaints: string[];
  spo2:number;
  temperature:number;
}

interface Prescription {
  medicines: Medicine[];
}

interface GroupedData {
  diagnosisDate: string;
  diagnosisDetails: DiagnosisDetails;
  relatedPrescriptions: Prescription[];
}

interface MedicalHistoryResponse {
  patientName: string;
  groupedData: GroupedData[];
}




export function MedicalHistory({patientId}: MedicalHistoryProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [medicalHistory, setMedicalHistory]=useState<MedicalHistoryResponse | null>(null);
  const [patient, setPatient]=useState<Patient | null>(null);
  const params=useParams();
  const apiUrl = environment.apiUrl;
  const navigate=useNavigate();

  if (showSummary) {
    return <Summarizer />;
  }

  const hospitalcontext=useContext(HospitalContext);
  const doctorcontext=useContext(DoctorContext);
  const patientcontext=useContext(PatientContext);

  const getHistory=async()=>{
    const response = await axios.get(`${apiUrl}/medical-history/${patientId}`,
      {
        withCredentials:true
      }
    );

    setMedicalHistory(response.data);

    console.log("Medical history:", response.data);
  }


  const getPatient=async()=>{
    const response = await axios.get(`${apiUrl}/hospitals/${params.hospitalId}/patients/${patientId}`,
      {
        withCredentials:true
      }
    );

    setPatient(response.data[0]);

    console.log("Patient history:", response.data);
  }

  useEffect(()=>{
    getHistory();
    getPatient();
  },[params.patientId,params.hospitalId, params.doctorId]);

  return (
    <div className={styles['container']}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h4" gutterBottom>
            {patient?.firstName}{patient?.lastName}'s Medical History
          </Typography>
        </Grid>
        {/* <Grid item>
          <Tooltip title="Generate Summary">
            <IconButton
              onClick={() => navigate(`/hospitals/${params.hospitalId}/patients/${params.patientId}/ai-summarizer`)}
              aria-label="ai-summarizer"
            >
              <AutoAwesomeOutlinedIcon sx={{ marginRight: 6 }} />
            </IconButton>
          </Tooltip>
        </Grid> */}
      </Grid>

      {medicalHistory?.groupedData.slice(0,1).map((item)=>(
        <Card  sx={{ marginBottom: 4 }}>
          <CardContent>
            <Box
              sx={{ backgroundColor: '#e0f2f1', padding: 2, borderRadius: 1 }}
            >
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">Date: {item.diagnosisDate}</Typography>
                <div>
                  <IconButton
                    sx={{ marginRight: 2 }}
                    onClick={() => window.print()}
                    aria-label="print"
                  >
                    <PrintIcon />
                  </IconButton>
                </div>
              </Grid>
            </Box>
            <Divider sx={{ marginBottom: 2 }} />

            <Typography variant="subtitle1">Vitals:</Typography>
            {/* {meditem.((item)=>( */}
               <Typography variant="body1" sx={{ marginBottom: 2 }}>
               Height: {item.diagnosisDetails.height} cm, Weight: {item.diagnosisDetails.weight}{' '}
               kg, Pulse: {item.diagnosisDetails.pulse} bpm, SPO2: {item.diagnosisDetails.spo2} %,
               BMI: {}, Temperature: {item.diagnosisDetails.temperature}{' '}
               °C
             </Typography>
            {/* )) */}

            {/* } */}
            

            <Divider sx={{ marginY: 2 }} />

            <Typography
              variant="subtitle1"
              sx={{
                backgroundColor: '#ffe6e6', // Light red background
                padding: '8px',
                borderRadius: '4px',
                display: 'inline', // Keeps the diagnosis on the same line
              }}
            >
              Diagnosis:
            </Typography>
            {/* {medicalHistory?.diagnoses.map((item)=> */}
            (<Typography
              variant="body1"
              sx={{ display: 'inline', marginLeft: '4px' }}
            >
              {item.diagnosisDetails.details}
            </Typography>)
            {/* )} */}

            <Divider sx={{ marginY: 2 }} />

            <Typography variant="subtitle1">Prescriptions</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Medicine Name</TableCell>
                    <TableCell>Dose</TableCell>
                    <TableCell>Instructions</TableCell>
                    <TableCell>Frequency</TableCell>
                    <TableCell>Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {item?.relatedPrescriptions.map((prescription, idx) => 
                    (prescription.medicines.map((medicine)=>(
                      <TableRow key={idx}>
                      <TableCell>{medicine.medicineName}</TableCell>
                      <TableCell>{medicine.dose}</TableCell>
                      <TableCell>{medicine.instructions}</TableCell>
                      <TableCell>{medicine.frequency}</TableCell>
                      <TableCell>{medicine.duration}</TableCell>
                    </TableRow>
                    )))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        ))}
    </div>
  );
}

export default MedicalHistory;
