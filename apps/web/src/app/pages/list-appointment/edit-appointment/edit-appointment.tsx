import styles from './edit-appointment.module.scss';
import { GenderEnum } from '../add-appointment/add-appointment';
import * as yup from 'yup';
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import { ViewAllUser, ViewAppointment } from '@healthcare/data-transfer-types';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { environment } from '../../../../environments/environment';
import dayjs from 'dayjs';

/* eslint-disable-next-line */
export interface EditAppointmentProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: Form) => void;
  initialData: ViewAppointment | null;
}

export interface Form {
  patient: ViewAllUser | null;
  appointmentDate: Date;
  statusId: number;
}

export enum StatusEnum {
  PENDING = "Pending",
  INPROGRESS = "In Progress",
  CANCELLED = "Cancelled",
  CONFIRMED = "Confirmed",
}



const EditAppointment: React.FC<EditAppointmentProps> = ({ open, onClose, onUpdate, initialData }) => {


  const validationSchema = yup.object().shape({
    patient: yup.object().nullable().required('User is required'),
    appointmentDate: yup.date().required('Date is required'),
    statusId: yup.number().required('Status is required'),
  });

  const { handleSubmit, control, reset, formState: { errors },  setValue } = useForm<Form>({
    resolver: yupResolver(validationSchema),

  });

  const apiUrl = environment.apiUrl;
  const [patients, setPatients] = useState<ViewAllUser[]>([]);

  console.log('initialData', initialData)
  useEffect(() => {
    if (initialData) {
      setValue('patient', initialData.patient.user);
      setValue('statusId', initialData.status.id);
      setValue('appointmentDate',new Date(initialData.appointmentDate));
    }
  }, [initialData, setValue]);

  const handleUpdate = (data: Form) => {
    console.log('data', data)
    onUpdate(data);
    reset();
  };

  const fetchProjectMembersData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/hospitals/1/patients`, {
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
    fetchProjectMembersData();
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
       Edit Appointment
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
      <form onSubmit={handleSubmit(handleUpdate)}>
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
                    // setPatientSelected(selectedPatient ? selectedPatient.id : null);
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
                      {...field}
                      value={field.value ? dayjs(field.value) : undefined}
                      // onChange={field.onChange}
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
                  render={({ field }) => (
                    <Select
                      sx={{ width: '100%', marginBottom: 1 }}
                      label="Status*"
                      variant="outlined"
                      {...field}
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
}

export default EditAppointment;
