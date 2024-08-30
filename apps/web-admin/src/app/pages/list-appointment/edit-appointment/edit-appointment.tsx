import styles from './edit-appointment.module.scss';
import { GenderEnum } from '../add-appointment/add-appointment';
import { Form } from '../add-appointment/add-appointment';
import * as yup from 'yup';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Modal, Select, TextField } from '@mui/material';
import { ViewAppointment } from '@healthcare/data-transfer-types';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CancelIcon from '@mui/icons-material/Cancel';

/* eslint-disable-next-line */
export interface EditAppointmentProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: ViewAppointment) => void;
  initialData: ViewAppointment | null;
}



const EditAppointment: React.FC<EditAppointmentProps> = ({ open, onClose, onUpdate }) => {


  const validationSchema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    mobileNumber: yup.string().required('Mobile Number is required'),
    email: yup.string().required('Email is required'),
    gender: yup.string().required('Gender is required'),
    age: yup.number().required('Age is required'),
    date: yup.date().required('Date is Required')
  });

  const { handleSubmit, control, reset, formState: { errors }, watch, setValue } = useForm<ViewAppointment>({
    resolver: yupResolver(validationSchema),

  });

  const handleUpdate = (data: ViewAppointment) => {
    onUpdate(data);
    reset();
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',padding:'' }}>
      <DialogTitle className={styles['h2_tag']} >Edit Appointment </DialogTitle>
      <IconButton onClick={() => { onClose(); reset(); }}>
        <CancelIcon></CancelIcon>
      </IconButton>
      </Box>
      <form onSubmit={handleSubmit(handleUpdate)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} className={styles['grid_top']}>
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                rules={{ required: 'First Name is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                      '& .MuiInputBase-root': {
                        height: 50, // Adjust height here
                      },
                      '& .MuiInputBase-input': {
                        padding: '10px 14px', // Adjust padding to fit height
                        fontSize: '0.955rem', // Adjust font size if needed
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '1rem', // Adjust label font size if needed
                        top: -6, // Adjust label position if needed
                      },
                    }}
                    className="form-control"
                    placeholder="Enter Doctor First Name"
                    {...field}
                    label="First Name"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} className={styles['grid_top']}>
              <Controller
                name="lastName"
                control={control}
                defaultValue=""
                rules={{ required: 'lastName Name is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                      '& .MuiInputBase-root': {
                        height: 50, // Adjust height here
                      },
                      '& .MuiInputBase-input': {
                        padding: '10px 14px', // Adjust padding to fit height
                        fontSize: '0.955rem', // Adjust font size if needed
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '1rem', // Adjust label font size if needed
                        top: -6, // Adjust label position if needed
                      },
                    }}
                    className="form-control"
                    placeholder="Enter Doctor First Name"
                    {...field}
                    label="last Name"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} className={styles['grid_top']}>
              <Controller
                name="mobileNumber"
                control={control}
                defaultValue=""
                rules={{ required: 'mobileNumber is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                      '& .MuiInputBase-root': {
                        height: 50, // Adjust height here
                      },
                      '& .MuiInputBase-input': {
                        padding: '10px 14px', // Adjust padding to fit height
                        fontSize: '0.955rem', // Adjust font size if needed
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '1rem', // Adjust label font size if needed
                        top: -6, // Adjust label position if needed
                      },
                    }}
                    className="form-control"
                    placeholder="Enter Doctor First Name"
                    {...field}
                    label="mobile Number"
                    error={!!errors.mobileNumber}
                    helperText={errors.mobileNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} className={styles['grid_top']}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{ required: 'email is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                      '& .MuiInputBase-root': {
                        height: 50, // Adjust height here
                      },
                      '& .MuiInputBase-input': {
                        padding: '10px 14px', // Adjust padding to fit height
                        fontSize: '0.955rem', // Adjust font size if needed
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '1rem', // Adjust label font size if needed
                        top: -6, // Adjust label position if needed
                      },
                    }}
                    className="form-control"
                    placeholder="Enter Doctor email"
                    {...field}
                    label="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} className={styles['grid_top']}>
              <Controller
                name="age"
                control={control}
                rules={{ required: 'age is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                      '& .MuiInputBase-root': {
                        height: 50, // Adjust height here
                      },
                      '& .MuiInputBase-input': {
                        padding: '10px 14px', // Adjust padding to fit height
                        fontSize: '0.955rem', // Adjust font size if needed
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '1rem', // Adjust label font size if needed
                        top: -6, // Adjust label position if needed
                      },
                    }}
                    className="form-control"
                    placeholder="Enter Doctor age"
                    {...field}
                    label="age"
                    error={!!errors.age}
                    helperText={errors.age?.message}
                  />
                )}
              />
            </Grid>
            {/* Repeat Grid items for other fields similarly */}
            <Grid item xs={12} md={6} className={styles['grid_top']}>
              <FormControl sx={{ width: '100%' }}>
                <InputLabel htmlFor="gender">Gender*</InputLabel>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: 'Gender is required' }}
                  render={({ field }) => (
                    <Select
                      sx={{
                        width: '100%',
                        marginBottom: 1,
                        '& .MuiInputBase-root': {
                          height: 50, // Adjust height here
                        },
                        '& .MuiInputBase-input': {
                          padding: '10px 14px', // Adjust padding to fit height
                          fontSize: '0.955rem', // Adjust font size if needed
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem', // Adjust label font size if needed
                          top: -6, // Adjust label position if needed
                        },
                      }}
                      label="Gender*"
                      variant="outlined"
                      {...field}
                      error={!!errors.gender}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 100
                          },
                        },
                      }}
                    >
                      <MenuItem sx={{ justifyContent: "start" }} value="MALE">MALE</MenuItem>
                      <MenuItem sx={{ justifyContent: "start" }} value="FEMALE">FEMALE</MenuItem>
                      <MenuItem sx={{ justifyContent: "start" }} value="OTHERS">OTHERS</MenuItem>
                    </Select>
                  )}
                />
                <FormHelperText sx={{ color: "#d32f2f" }}>{errors.gender?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} className={styles['grid_top']}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="Basic date picker"
                    sx={{
                      '& .MuiInputBase-root': {
                        height: 50, // Adjust height here
                        overflow: 'hidden', // Prevent overflow
                      },
                      '& .MuiInputBase-input': {
                        padding: '10px 14px', // Adjust padding to fit within the height
                      },
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={() => { onClose(); reset(); }}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditAppointment;
