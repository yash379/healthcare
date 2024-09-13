import React, { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import styles from './diagnosis-page.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DiagnosisPageProps {}

interface Diagnosis {
  id: number;
  doctorId: number;
  patientId: number;
  details: string;
  height: number;
  weight: number;
  pulse: number;
  spo2: number;
  temperature: number;
  chiefComplaints: string[];
  medicineName: string;
  instructions: string;
  dose: string;
  when: string;
  frequency: string;
  duration: string;
  diagnosisDate: string;
  bmi: string;
}

export function DiagnosisPage(props: DiagnosisPageProps) {
  const [diagnosis, setDiagnosis] = useState<string[]>([]);
  const apiUrl = environment.apiUrl;
  const [newPrescription, setNewPrescription] = useState({
    medicineName: '',
    dose: '',
    instructions: '',
    frequency: '',
    duration: '',
  });

  const validationSchema = yup.object().shape({
    details: yup.string().required('Details are required'),
    height: yup.number().required('Height is required'),
    weight: yup.number().required('Weight is required'),
    pulse: yup.number().required('Pulse is required'),
    spo2: yup.number().required('SpO2 is required'),
    bmi: yup.string().required('BMI is required'),
    temperature: yup.number().required('Temperature is required'),
    chiefComplaints: yup
      .array()
      .of(yup.string().required('Each complaint must be valid'))
      .min(1, 'At least one chief complaint is required'),
    medicineName: yup.string().required('Medicine name is required'),
    instructions: yup.string().required('Instructions are required'),
    dose: yup.string().required('Dose is required'),
    when: yup.string().required('When to take is required'),
    frequency: yup.string().required('Frequency is required'),
    duration: yup.string().required('Duration is required'),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleAddDiagnosis = async (formData: any) => {
    console.log('form data ', formData)
    try {
      const { data: responseData } = await axios.post(
        `${apiUrl}/diagnosis`,
        {
          id: formData.id,
          details: formData.details,
          doctorId: formData.doctorId,
          patientId: formData.patientId,
          height: formData.height,
          weight: formData.weight,
          pulse: formData.pulse,
          spo2: formData.spo2,
          bmi: formData.bmi,
          temperature: formData.temperature,
          chiefComplaints: formData.chiefComplaints,
          diagnosisDate: formData.diagnosisDate,
        },
        {
          withCredentials: true,
        }
      );

      if (responseData) {
        reset();
        enqueueSnackbar('Diagnosis added successfully!', { variant: 'success' });
      } else {
        console.log('Something went wrong');
      }
    } catch (error) {
      console.log('Something went wrong in the input form', error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  // Dummy data for diagnosis and chief complaints
  const diagnosisOptions = ['Flu', 'Common Cold', 'Gastritis', 'Migraine', 'Diabetes'];
  const chiefComplaintOptions = ['Headache', 'Fever', 'Cough', 'Abdominal Pain'];

  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string[]>([]);
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);

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
        <form onSubmit={handleSubmit(handleAddDiagnosis)}>
          <Box sx={{ display: 'flex', marginBottom: '20px' }}>
            <Avatar sx={{ bgcolor: '#4FD1C5' }}>OP</Avatar>
            <Box sx={{ marginLeft: '10px' }}>
              <Typography sx={{ fontWeight: 'bold' }}>Mr. Omkar Patil</Typography>
              <Box sx={{ display: 'flex' }}>
                <Typography>32y |</Typography>
                <Typography sx={{ marginLeft: '3px' }}>Male |</Typography>
                <Typography sx={{ marginLeft: '3px' }}>899991111</Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ marginBottom: '20px' }} />

          {/* Vitals Section */}
          <Box sx={{ marginBottom: '20px' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '25px', color: '#2B3674' }}>
              Vitals
            </Typography>
            <Grid container spacing={2} sx={{ marginTop: '10px' }}>
        <Grid item xs={6}>
          <Controller
            name="height"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Height (cm)"
                variant="outlined"
                fullWidth
                error={!!errors.height}
                helperText={errors.height?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="weight"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Weight (kg)"
                variant="outlined"
                fullWidth
                error={!!errors.weight}
                helperText={errors.weight?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="pulse"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Pulse (bpm)"
                variant="outlined"
                fullWidth
                error={!!errors.pulse}
                helperText={errors.pulse?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="spo2"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="SpO2 (%)"
                variant="outlined"
                fullWidth
                error={!!errors.spo2}
                helperText={errors.spo2?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="bmi"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="BMI"
                variant="outlined"
                fullWidth
                error={!!errors.bmi}
                helperText={errors.bmi?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="temperature"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Temperature (°C)"
                variant="outlined"
                fullWidth
                error={!!errors.temperature}
                helperText={errors.temperature?.message}
              />
            )}
          />
        </Grid>
      </Grid>
          </Box>

          <Divider sx={{ marginBottom: '20px' }} />

          {/* Chief Complaints Section */}
          <Typography sx={{ fontWeight: 'bold', fontSize: '25px', color: '#2B3674' }}>
            Chief Complaints
          </Typography>
          <Autocomplete
            multiple
            options={chiefComplaintOptions}
            value={selectedComplaints}
            onChange={(event, newValue) => setSelectedComplaints(newValue)}
            renderTags={(value: string[], getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Select Chief Complaints" />
            )}
            sx={{ marginTop: '10px' }}
          />

          <Divider sx={{ marginBottom: '20px', marginTop: '20px' }} />

          <Typography sx={{ fontWeight: 'bold', fontSize: '25px', color: '#2B3674' }}>
            Diagnosis
          </Typography>
          <Autocomplete
            multiple
            options={diagnosisOptions}
            value={selectedDiagnosis}
            onChange={(event, newValue) => setSelectedDiagnosis(newValue)}
            renderTags={(value: string[], getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Select Diagnosis" />
            )}
            sx={{ marginTop: '10px' }}
          />

          <Divider sx={{ marginBottom: '20px', marginTop: '20px' }} />

          {/* Prescription Section */}
          {/* <Typography sx={{ fontWeight: 'bold', fontSize: '25px', color: '#2B3674' }}>
            Prescription
          </Typography>
          <Grid container spacing={2} sx={{ marginBottom: '10px', marginTop: '5px' }}>
            <Grid item xs={6}>
              <TextField
                label="Medicine Name"
                value={newPrescription.medicineName}
                onChange={(e) =>
                  setNewPrescription({ ...newPrescription, medicineName: e.target.value })
                }
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Dose"
                value={newPrescription.dose}
                onChange={(e) => setNewPrescription({ ...newPrescription, dose: e.target.value })}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Instructions"
                value={newPrescription.instructions}
                onChange={(e) =>
                  setNewPrescription({ ...newPrescription, instructions: e.target.value })
                }
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Frequency"
                value={newPrescription.frequency}
                onChange={(e) =>
                  setNewPrescription({ ...newPrescription, frequency: e.target.value })
                }
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Duration"
                value={newPrescription.duration}
                onChange={(e) =>
                  setNewPrescription({ ...newPrescription, duration: e.target.value })
                }
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddPrescription}
            sx={{ marginBottom: '20px' }}
          >
            Add Prescription
          </Button>

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
                      <IconButton onClick={() => handleDeletePrescription(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ marginTop: '20px' }} /> */}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: '20px' }}
          >
            Submit Diagnosis
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default DiagnosisPage;
