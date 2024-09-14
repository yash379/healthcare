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
import Summarizer from '../ai-summarizer/ai-summarizer';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { ViewPatient } from '@healthcare/data-transfer-types';
import { useCallback, useEffect, useState } from 'react';

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
}

interface Prescription {
  medicines: Medicine[];
}

interface GroupedData {
  diagnosisDate: string;
  diagnosisDetails: DiagnosisDetails;
  relatedPrescriptions: Prescription[];
}

interface MedicalHistory {
  patientName: string;
  groupedData: GroupedData[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MedicalHistoryProps {}

export function MedicalHistory(props: MedicalHistoryProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<ViewPatient | null>(null);
  const params = useParams();
  const apiUrl = environment.apiUrl;

  const getAllMedicalHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/medical-history/${params.patientId}`,
        { withCredentials: true }
      );
      setMedicalHistory(response.data);
      console.log('Medical history Data', response.data);
    } catch (error) {
      console.error('Error fetching medical history data:', error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, params.patientId]);

  const getPatient = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/hospitals/${params.hospitalId}/patients/${params.patientId}`,
        { withCredentials: true }
      );
      const patient = response.data?.[0] || null;
      setPatientData(patient);
      console.log('Patient Data', response.data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, params.hospitalId, params.patientId]);

  useEffect(() => {
    getAllMedicalHistory();
  }, [getAllMedicalHistory]);

  useEffect(() => {
    getPatient();
  }, [getPatient]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (showSummary) {
    return <Summarizer />;
  }

  if (!medicalHistory || !medicalHistory.groupedData) {
    return <div>No medical history data available.</div>;
  }
  return (
    <div className={styles['container']}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h4" gutterBottom>
            {patientData?.firstName} {patientData?.lastName}'s Medical History
          </Typography>
        </Grid>
        <Grid item>
          <Tooltip title="Generate Summary">
            <IconButton
              onClick={() => setShowSummary(true)}
              aria-label="ai-summarizer"
            >
              <AutoAwesomeOutlinedIcon sx={{ marginRight: 6 }} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      {/* Render the medical history data */}
      {medicalHistory.groupedData.map((entry: GroupedData, index: number) => (
        <Card key={index} sx={{ marginBottom: 4 }}>
          <CardContent>
            <Box
              sx={{ backgroundColor: '#e0f2f1', padding: 2, borderRadius: 1 }}
            >
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  Date: {entry.diagnosisDate}
                </Typography>
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
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              Height: {entry.diagnosisDetails.height} cm, Weight:{' '}
              {entry.diagnosisDetails.weight} kg, Pulse:{' '}
              {entry.diagnosisDetails.pulse} bpm
            </Typography>

            <Divider sx={{ marginY: 2 }} />

            <Typography variant="subtitle1"  sx={{
                backgroundColor: '#ffe6e6', // Light red background
                padding: '8px',
                borderRadius: '4px',
                display: 'inline', // Keeps the diagnosis on the same line
              }}>Diagnosis:</Typography>
            <Typography variant="body1" sx={{ display: 'inline', marginLeft: '4px' }}>
              {entry.diagnosisDetails.details}
            </Typography>

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
                  {entry.relatedPrescriptions.map((prescription: Prescription, idx: number) =>
                    // Loop through medicines inside the prescription
                    prescription.medicines.map((medicine: Medicine, medIdx: number) => (
                      <TableRow key={medIdx}>
                        <TableCell>{medicine.medicineName}</TableCell>
                        <TableCell>{medicine.dose}</TableCell>
                        <TableCell>{medicine.instructions}</TableCell>
                        <TableCell>{medicine.frequency}</TableCell>
                        <TableCell>{medicine.duration}</TableCell>
                      </TableRow>
                    ))
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
