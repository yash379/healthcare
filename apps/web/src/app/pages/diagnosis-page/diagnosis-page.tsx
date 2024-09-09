import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Divider,
  Paper,
  TextField,
  Typography,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import styles from './diagnosis-page.module.scss';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DiagnosisPageProps {}

export function DiagnosisPage(props: DiagnosisPageProps) {
  const [diagnosis, setDiagnosis] = useState<string[]>([]);
  const [newPrescription, setNewPrescription] = useState({
    medicineName: '',
    dose: '',
    instructions: '',
    frequency: '',
    duration: '',
  });
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  // Dummy data for Diagnosis and Chief Complaints
  const diagnosisOptions = [
    'Flu',
    'Common Cold',
    'Gastritis',
    'Migraine',
    'Diabetes',
  ];
  const chiefComplaintOptions = [
    'Headache',
    'Fever',
    'Cough',
    'Abdominal Pain',
  ];

  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string[]>([]);
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);

  const handleDiagnosisChange = (event: any, value: string[]) => {
    setDiagnosis(value);
  };

  const handleAddPrescription = () => {
    setPrescriptions([...prescriptions, newPrescription]);
    setNewPrescription({
      medicineName: '',
      dose: '',
      instructions: '',
      frequency: '',
      duration: '',
    });
  };

  const handleDeletePrescription = (index: number) => {
    const newPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(newPrescriptions);
  };

  return (
    <Box className={styles['container']}>
      <Paper
        sx={{
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {/* Patient Information */}
        <Box sx={{ display: 'flex', marginBottom: '20px' }}>
          <Avatar sx={{ bgcolor: '#4FD1C5' }}>OP</Avatar>
          <Box sx={{ marginLeft: '10px' }}>
            <Typography
              sx={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 'bold' }}
            >
              Mr. Omkar Patil
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <Typography>32y |</Typography>
              <Typography
                sx={{
                  marginLeft: '3px',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 'light',
                }}
              >
                Male |
              </Typography>
              <Typography
                sx={{
                  marginLeft: '3px',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 'light',
                }}
              >
                899991111
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider
          sx={{ color: '#EBFAF9', height: '2px', marginBottom: '20px' }}
        />

        {/* Vitals Section */}
        <Box sx={{ marginBottom: '20px' }}>
          <Typography
            sx={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 'bold',
              fontSize: '25px',
              color: '#2B3674',
            }}
          >
            Vitals
          </Typography>
          <Grid container spacing={2} sx={{ marginTop: '10px' }}>
            <Grid item xs={6}>
              <TextField label="Height (cm)" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Weight (kg)" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Pulse (bpm)" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label="SpO2 (%)" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label="BMI" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Temperature (°C)"
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>

        <Divider
          sx={{ color: '#EBFAF9', height: '2px', marginBottom: '20px' }}
        />

        {/* Chief Complaints Section */}
        <Box
          sx={{
            marginTop: '2px',
            marginBottom: '20px',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 'Bold',
            fontSize: '25px',
            color: '#2B3674',
          }}
        >
          Chief Complaints
        </Box>
        <Autocomplete
          multiple
          options={chiefComplaintOptions}
          value={selectedComplaints}
          onChange={(event, newValue) => setSelectedComplaints(newValue)}
          renderTags={(value: string[], getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Select Chief Complaints"
              placeholder="Complaints"
            />
          )}
          sx={{ marginTop: '10px' }}
        />

        <Divider
          sx={{
            color: '#EBFAF9',
            height: '2px',
            marginBottom: '20px',
            marginTop: '20px',
          }}
        />

        {/* Diagnosis Section */}
        <Box
          sx={{
            marginTop: '20px',
            marginBottom: '20px',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 'Bold',
            fontSize: '25px',
            color: '#2B3674',
          }}
        >
          Diagnosis
        </Box>
        <Autocomplete
          multiple
          options={diagnosisOptions}
          value={selectedDiagnosis}
          onChange={(event, newValue) => setSelectedDiagnosis(newValue)}
          renderTags={(value: string[], getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Select Diagnosis"
              placeholder="Diagnosis"
            />
          )}
          sx={{ marginTop: '10px' }}
        />

        <Divider
          sx={{
            color: '#EBFAF9',
            height: '2px',
            marginBottom: '20px',
            marginTop: '20px',
          }}
        />

        {/* Prescription Section */}
        <Box sx={{ marginBottom: '20px' }}>
          <Typography
            sx={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 'bold',
              fontSize: '25px',
              color: '#2B3674',
            }}
          >
            Prescription
          </Typography>
          <Grid
            container
            spacing={2}
            sx={{ marginBottom: '10px', marginTop: '5px' }}
          >
            <Grid item xs={6}>
              <TextField
                label="Medicine Name"
                value={newPrescription.medicineName}
                onChange={(e) =>
                  setNewPrescription({
                    ...newPrescription,
                    medicineName: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Dose"
                value={newPrescription.dose}
                onChange={(e) =>
                  setNewPrescription({
                    ...newPrescription,
                    dose: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Instructions"
                value={newPrescription.instructions}
                onChange={(e) =>
                  setNewPrescription({
                    ...newPrescription,
                    instructions: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Frequency"
                value={newPrescription.frequency}
                onChange={(e) =>
                  setNewPrescription({
                    ...newPrescription,
                    frequency: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Duration"
                value={newPrescription.duration}
                onChange={(e) =>
                  setNewPrescription({
                    ...newPrescription,
                    duration: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handleAddPrescription} color="primary">
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>

          {/* Prescription Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Medicine Name</TableCell>
                  <TableCell>Dose</TableCell>
                  <TableCell>Instructions</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prescriptions.map((prescription, index) => (
                  <TableRow key={index}>
                    <TableCell>{prescription.medicineName}</TableCell>
                    <TableCell>{prescription.dose}</TableCell>
                    <TableCell>{prescription.instructions}</TableCell>
                    <TableCell>{prescription.frequency}</TableCell>
                    <TableCell>{prescription.duration}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDeletePrescription(index)}
                        color="secondary"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Box>
  );
}

export default DiagnosisPage;
