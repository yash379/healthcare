import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import styles from './hospital-add-appointment.module.scss';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { useEffect, useState } from 'react';
import { Gender } from '@prisma/client';
import CancelIcon from '@mui/icons-material/Cancel';
import { environment } from '../../../../environments/environment';
import axios from 'axios';
import { ViewAllUser } from '@healthcare/data-transfer-types';
import { useParams } from 'react-router-dom';

export enum GenderEnum {
  female = 'female',
  male = 'male',
  other = 'other',
}

export enum StatusEnum {
  PENDING = "Pending",
  INPROGRESS = "In Progress",
  CANCELLED = "Cancelled",
  CONFIRMED = "Confirmed",
}

export interface Form {
  // firstName: string;
  // lastName: string;
  // mobileNumber: string;
  // email: string;
  // gender: Gender;
  // age: number;
  patient: ViewAllUser | null;
  doctor: ViewAllUser | null;
  appointmentDate: Date;
  statusId: number;
}
/* eslint-disable-next-line */
export interface HospitalAddAppointmentProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Form) => void;
}

const HospitalAddAppointment: React.FC<HospitalAddAppointmentProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const validationSchema = yup.object().shape({
    patient: yup.object().nullable().required('Please select patient'),
    doctor: yup.object().nullable().required('Please select doctor'),
    appointmentDate: yup.date().required('Date is required'),
    statusId: yup.number().required('Status is required'),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Form>({
    resolver: yupResolver(validationSchema),
  });

  const apiUrl = environment.apiUrl;
  const params = useParams();
  const [patients, setPatients] = useState<ViewAllUser[]>([]);
  const [doctors, setDoctors] = useState<ViewAllUser[]>([]);
  const [patientSelected, setPatientSelected] = useState<number | null>(null);

  const handleFormSubmit = (data: Form) => {
    console.log('handleAddForm:', data);
    // const formData = {
    //   ...data,
    //   // patientId: patientSelected,
    // };
    console.log('handleAddForm:', data);
    onSubmit(data);
  };

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const fetchPatientsData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/hospitals/${params.hospitalId}/patients`, {
        withCredentials: true,
      });
      console.log('filter user ', response.data);
      const userMembers = response.data;
      setPatients(userMembers);
    } catch (error) {
      console.error('Error', error);
    }
  };

  useEffect(() => {
    fetchPatientsData();
  }, [apiUrl]);

  const fetchDoctorsData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/hospitals/${params.hospitalId}/doctors`, {
        withCredentials: true,
      });
      console.log('filter user ', response.data);
      const userMembers = response.data.content;
      setDoctors(userMembers);
    } catch (error) {
      console.error('Error', error);
    }
  };

  useEffect(() => {
    fetchDoctorsData();
  }, [apiUrl]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <Box p={'5px 24px 24px 24px'}>
        <Typography
          variant="h2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '14px -10px 5px 0px',
          }}
        >
          Add Appointment
          <IconButton
            onClick={() => {
              onClose();
              reset();
            }}
            aria-label="Close"
          >
            <CancelIcon />
          </IconButton>
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box className={styles['grid_top']}>
            <Controller
              name="doctor"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={doctors}
                  getOptionLabel={(option) =>
                    `${option.firstName} ${option.lastName}`
                  }
                  onChange={(_, selectedDoctor) => {
                    field.onChange(selectedDoctor);
                    // Set the selected patient's ID in the state
                    // setPatientSelected(selectedUser ? selectedUser.id : null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Doctor"
                      placeholder="Search Doctor"
                      error={!!errors.doctor}
                      helperText={errors.doctor?.message}
                      fullWidth
                    />
                  )}
                />
              )}
            />
            </Box>

            <Box className={styles['grid_top']}>
            <Controller
              name="patient"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={patients}
                  getOptionLabel={(option) =>
                    `${option.firstName} ${option.lastName}`
                  }
                  onChange={(_, selectedPatient) => {
                    field.onChange(selectedPatient);
                    // Set the selected patient's ID in the state
                    // setPatientSelected(selectedUser ? selectedUser.id : null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Patient"
                      placeholder="Search Patient"
                      error={!!errors.patient}
                      helperText={errors.patient?.message}
                      fullWidth
                    />
                  )}
                />
              )}
            />
            </Box>

            <Box className={styles['grid_top']}>
              <Controller
                name="appointmentDate"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of Appointment"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          error: !!errors.appointmentDate,
                          helperText: errors.appointmentDate?.message,
                          fullWidth: true,
                        },
                      }}
                      sx={{ width: '100%' }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Box>

            <Box className={styles['grid_top']}>
              <FormControl sx={{ width: '100%' }}>
                <InputLabel htmlFor="status">Status</InputLabel>
                <Controller
                  name="statusId"
                  control={control}
                  defaultValue={1} // Set the default value to 1 (PENDING)
                  render={({ field }) => (
                    <Select
                      sx={{ width: '100%', marginBottom: 1 }}
                      label="Status*"
                      variant="outlined"
                      {...field}
                      disabled={true} // Disable the entire select field
                      error={!!errors.statusId}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 100,
                          },
                        },
                      }}
                    >
                      <MenuItem value={1}>
                        {StatusEnum.PENDING}
                      </MenuItem>
                      <MenuItem value={2}>
                        {StatusEnum.INPROGRESS}
                      </MenuItem>
                      <MenuItem value={3}>
                        {StatusEnum.CANCELLED}
                      </MenuItem>
                      <MenuItem value={4}>
                        {StatusEnum.CONFIRMED}
                      </MenuItem>
                    </Select>
                  )}
                />
                <FormHelperText sx={{ color: '#d32f2f' }}>
                  {errors.statusId?.message}
                </FormHelperText>
              </FormControl>
            </Box>
         
          <Box sx={{ mb: '5px', mt: '20px', textAlign: 'end' }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                onClose();
                reset();
              }}
            >
              Cancel
            </Button>
            <Button sx={{ ml: '10px' }} variant="contained" color="primary" type="submit">
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Dialog>
  );
};

export default HospitalAddAppointment;
