import React, { useCallback, useEffect, useState } from 'react';
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
import { Controller, useForm } from 'react-hook-form';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useParams } from 'react-router-dom';
import styles from './diagnosis-page.module.scss';
import { AcuteDisease, ChronicDisease, Gender } from '@prisma/client';
import dayjs from 'dayjs';
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

export interface ViewAppointment {
  id: number;
  appointmentDate: string;
  status: { id: number; code: string; name: string };
  patientId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  gender: Gender;
  age: number;
  bloodGroup: string;
  dob: string;
  digitalHealthCode: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  chronicDiseases?: ChronicDisease[];
  acuteDiseases?: AcuteDisease[];
  isActive: boolean;
}

export function DiagnosisPage(props: DiagnosisPageProps) {
  const [diagnosis, setDiagnosis] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [prescriptionData, setPrescriptionData] = useState<any[]>([]);
  const params = useParams();
  const apiUrl = environment.apiUrl;
  const [newPrescription, setNewPrescription] = useState({
    medicineName: '',
    dose: '',
    when: '',
    instructions: '',
    frequency: '',
    duration: '',
  });
  const [appointmentsData, setAppointmentsData] =
    useState<ViewAppointment | null>(null);

  const validationSchema = yup.object().shape({
    details: yup.string().required('Details are required'),
    height: yup.number().required('Height is required'),
    weight: yup.number().required('Weight is required'),
    pulse: yup.number().required('Pulse is required'),
    spo2: yup.number().required('SpO2 is required'),
    // bmi: yup.string().required('BMI is required'),
    temperature: yup.number().required('Temperature is required'),
    // chiefComplaints: yup
    //   .array()
    //   .of(yup.string().required('Each complaint must be valid'))
    //   .min(1, 'At least one chief complaint is required'),
    chiefComplaints: yup
      .array()
      .of(yup.string().required('Each complaint must be valid'))
      .min(1, 'At least one chief complaint is required'),
    diagnosisDate: yup.date().required('Date is required'),
    // medicineName: yup.string().required('Medicine name is required'),
    // instructions: yup.string().required('Instructions are required'),
    // dose: yup.string().required('Dose is required'),
    // when: yup.string().required('When to take is required'),
    // frequency: yup.string().required('Frequency is required'),
    // duration: yup.string().required('Duration is required'),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  console.log('prescriptiion', prescriptions);

  // Dummy data for diagnosis and chief complaints
  const chiefComplaintOptions = [
    'Headache',
    'Fever',
    'Cough',
    'Abdominal Pain',
  ];

  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string[]>([]);
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);

  const handleAddPrescription = () => {
    setPrescriptions([...prescriptions, newPrescription]);
    setNewPrescription({
      medicineName: '',
      dose: '',
      when: '',
      instructions: '',
      frequency: '',
      duration: '',
    });
  };

  const handleDeletePrescription = (index: number) => {
    const newPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(newPrescriptions);
  };

  // const getAllAppointments = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(
  //       `${apiUrl}/prescriptions`,
  //       {
  //         withCredentials: true,
  //         params: {
  //           pageSize: rowsPerPage,
  //           pageOffset: page -1,
  //           // appointmentDate: searchQueryName,
  //         },
  //       }
  //     );
  //     // console.log(response.data[0].user)
  //     const { content, total } = response.data;
  //     setPrescriptionData(response.data);
  //     setTotalItems(total);
  //     console.log('Admin Data', response.data.content);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching hospital data:', error);
  //     setLoading(false);
  //   }
  // }, [apiUrl, page, params.hospitalId, rowsPerPage]);

  // useEffect(() => {
  //   getAllAppointments();
  // }, [apiUrl, page, params.hospitalId, rowsPerPage, getAllAppointments]);

  // const handleAddDiagnosis = async (formData: any) => {
  //   try {
  //     const diagnosisPayload = {
  //       details: formData.details,
  //       doctorId: Number(params.doctorId),
  //       patientId: Number(params.patientId),
  //       height: formData.height,
  //       weight: formData.weight,
  //       pulse: formData.pulse,
  //       spo2: formData.spo2,
  //       temperature: formData.temperature,
  //       chiefComplaints: formData.chiefComplaints,
  //       diagnosisDate: formData.diagnosisDate,
  //     };

  //     const prescriptionPayload = prescriptions.map((prescription) => ({
  //         medicineName: prescription.medicineName,
  //         instructions: prescription.instructions,
  //         dose: prescription.dose,
  //         when: prescription.when,
  //         frequency: prescription.frequency,
  //         duration: prescription.duration,
  //         doctorId: Number(params.doctorId),
  //         patientId: Number(params.patientId),
  //         prescriptionDate: formData.diagnosisDate,
  //       }));

  //     // Send both payloads in parallel
  //     const [diagnosisResponse, prescriptionResponse] = await Promise.all([
  //       axios.post(`${apiUrl}/diagnoses`, diagnosisPayload, {
  //         withCredentials: true,
  //       }),
  //       axios.post(`${apiUrl}/prescriptions`, prescriptionPayload, {
  //         withCredentials: true,
  //       }),
  //     ]);

  //     if (diagnosisResponse.data && prescriptionResponse.data) {
  //       reset();
  //       enqueueSnackbar('Diagnosis and Prescription added successfully!', {
  //         variant: 'success',
  //       });
  //     } else {
  //       console.log('Something went wrong');
  //     }
  //   } catch (error) {
  //     console.error('Something went wrong in the input form', error);
  //     enqueueSnackbar('Something went wrong', { variant: 'error' });
  //   }
  // };

  const handleAddDiagnosis = async (formData: any) => {
    try {
        // Ensure prescriptions is defined and is an array
        if (!Array.isArray(prescriptions)) {
          console.error('Prescriptions is not defined or is not an array:', prescriptions);
          throw new Error('Prescriptions is not defined or is not an array.');
        }
    
        // Log prescriptions for debugging
        console.log('Processing prescriptions:', prescriptions);  

      const diagnosisPayload = {
        details: formData.details,
        doctorId: Number(params.doctorId),
        patientId: Number(params.patientId),
        height: formData.height,
        weight: formData.weight,
        pulse: formData.pulse,
        spo2: formData.spo2,
        temperature: formData.temperature,
        chiefComplaints: formData.chiefComplaints,
        diagnosisDate: formData.diagnosisDate,
      };

        console.log('call api dai')
      // Send the diagnosis payload first
      const diagnosisResponse = await axios.post(
        `${apiUrl}/diagnoses`,
        diagnosisPayload,
        {
          withCredentials: true,
        }
      );

        console.log('call api after fai')
      if (!diagnosisResponse.data) {
        throw new Error('Failed to add diagnosis');
      }
  console.log('call api presc')
   // Verify and process each prescription
    // Process each prescription and its associated medicines
    console.log('Processing prescriptions:', prescriptions);
 // Process and group medicines by a common identifier (e.g., prescriptionId)
 const groupedPrescriptions = prescriptions.reduce((acc: any, medicine: any) => {
  // Here, assuming each medicine has a `prescriptionId`
  const { prescriptionId, ...medicineData } = medicine;
  if (!acc[prescriptionId]) {
    acc[prescriptionId] = {
      doctorId: Number(params.doctorId),
      patientId: Number(params.patientId),
      prescriptionDate: formData.diagnosisDate,
      medicines: [],
    };
  }
  acc[prescriptionId].medicines.push(medicineData);
  return acc;
}, {});

// Convert grouped prescriptions to array format
const prescriptionsPayload = Object.values(groupedPrescriptions);

console.log('Sending prescriptions payload:', { prescriptions: prescriptionsPayload });


console.log('Sending prescriptions payload:', { prescriptions: prescriptionsPayload });


    
      // Send all prescriptions in one request
      const prescriptionsResponse = await axios.post(
        `${apiUrl}/prescriptions`,
        { prescriptions: prescriptionsPayload },
        {
          withCredentials: true,
        }
      );
  
      if (!prescriptionsResponse.data) {
        throw new Error('Failed to add prescriptions');
      }

      reset({
        height: 0,
        weight: 0,
        pulse: 0,
        spo2: 0,
        details: '',
        temperature: 0,
        chiefComplaints: []
      });
      enqueueSnackbar('Diagnosis and Prescriptions added successfully!', {
        variant: 'success',
      });
    } catch (error) {
      console.error('Something went wrong in the input form', error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  const getAllAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/hospitals/${params.hospitalId}/doctors/${params.doctorId}/patients/${params.patientId}/appointments/${params.appointmentId}`,
        {
          withCredentials: true,
          params: {
            pageSize: rowsPerPage,
            pageOffset: page - 1,
            // appointmentDate: searchQueryName,
          },
        }
      );
      // console.log(response.data[0].user)
      const { content, total } = response.data;
      setAppointmentsData(response.data);
      // setTotalItems(total);
      console.log('Admin Data', response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      setLoading(false);
    }
  }, [
    apiUrl,
    page,
    params.appointmentId,
    params.doctorId,
    params.hospitalId,
    params.patientId,
    rowsPerPage,
  ]);

  useEffect(() => {
    getAllAppointments();
  }, [apiUrl, page, params.hospitalId, rowsPerPage, getAllAppointments]);

  const today = dayjs();

  return (
    <Box className={styles['container']}>
      <Paper
        sx={{
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {/* <form onSubmit={handleSubmit(handleAddDiagnosis)}> */}
        <form onSubmit={handleSubmit(handleAddDiagnosis)}>
          <Box sx={{ display: 'flex', marginBottom: '20px' }}>
            <Avatar sx={{ bgcolor: '#4FD1C5' }}>OP</Avatar>
            <Box sx={{ marginLeft: '10px' }}>
              <Typography sx={{ fontWeight: 'bold' }}>
                {appointmentsData?.firstName} {appointmentsData?.lastName}
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <Typography>{appointmentsData?.age} |</Typography>
                <Typography sx={{ marginLeft: '3px' }}>
                  {appointmentsData?.gender} |
                </Typography>
                <Typography sx={{ marginLeft: '3px' }}>
                  {appointmentsData?.phoneNumber}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ marginBottom: '20px' }} />

          {/* Vitals Section */}
          <Box sx={{ marginBottom: '20px' }}>
            <Typography
              sx={{ fontWeight: 'bold', fontSize: '25px', color: '#2B3674' }}
            >
              Vitals
            </Typography>
            <Grid container spacing={2} sx={{ marginTop: '10px' }}>
              <Grid item xs={6}>
                <Controller
                  name="height"
                  control={control}
                  defaultValue={0}
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
                  defaultValue={0}
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
                  defaultValue={0}
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
                  defaultValue={0}
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
                  name="details"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Details"
                      variant="outlined"
                      fullWidth
                      error={!!errors.details}
                      helperText={errors.details?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="temperature"
                  control={control}
                  defaultValue={0}
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

          <Typography
            sx={{ fontWeight: 'bold', fontSize: '25px', color: '#2B3674' }}
          >
            Chief Complaints
          </Typography>
          <Controller
            name="chiefComplaints"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Autocomplete
                multiple
                options={chiefComplaintOptions}
                value={field.value}
                onChange={(event, newValue) => field.onChange(newValue)}
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
                  />
                )}
                sx={{ marginTop: '10px' }}
              />
            )}
          />
          {errors.chiefComplaints && (
            <Typography color="error">
              {errors.chiefComplaints.message}
            </Typography>
          )}

          <Divider sx={{ marginBottom: '20px', marginTop: '20px' }} />

          {/* <Typography sx={{ fontWeight: 'bold', fontSize: '25px', color: '#2B3674' }}>
            Diagnosis
          </Typography>
          <Controller
            name="diagnosis"
            control={control}
            render={({ field }) => (
              <Autocomplete
                multiple
                options={diagnosisOptions}
                value={field.value}
                onChange={(event, newValue) => field.onChange(newValue)}
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
            )}
          /> */}

          <Controller
            name="diagnosisDate"
            control={control}
            defaultValue={today}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Diagnosis"
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{
                    textField: {
                      error: !!errors.diagnosisDate,
                      helperText: errors.diagnosisDate?.message,
                      fullWidth: true,
                    },
                  }}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            )}
          />

          <Divider sx={{ marginTop: '20px' }} />

          {/* Prescription Section */}
          <Typography
            sx={{ fontWeight: 'bold', fontSize: '25px', color: '#2B3674' }}
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
                variant="outlined"
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
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="When"
                value={newPrescription.when}
                onChange={(e) =>
                  setNewPrescription({
                    ...newPrescription,
                    when: e.target.value,
                  })
                }
                variant="outlined"
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
                variant="outlined"
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
                variant="outlined"
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
                {prescriptions?.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell>{prescription.medicineName}</TableCell>
                    <TableCell>{prescription.dose}</TableCell>
                    <TableCell>{prescription.instructions}</TableCell>
                    <TableCell>{prescription.frequency}</TableCell>
                    <TableCell>{prescription.duration}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          handleDeletePrescription(prescription.id)
                        }
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ marginTop: '20px' }} />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: '20px' }}
          >
            Submit Diagnosis
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default DiagnosisPage;
