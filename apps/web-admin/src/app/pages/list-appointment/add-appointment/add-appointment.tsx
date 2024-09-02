import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Modal, Select, TextField } from '@mui/material';
import styles from './add-appointment.module.scss';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { useEffect } from 'react';
import { Gender } from '@prisma/client';
import CancelIcon from '@mui/icons-material/Cancel';

export enum GenderEnum {
  female = "female",
  male = "male",
  other = "other",
}

export enum StatusEnum {
  Scheduled = "Scheduled",
  InProgress = "In Progress",
  Cancelled = "Cancelled",
  PendingConfirmation = "Pending Confirmation",
}

export interface Form {
  firstName: string
  lastName: string
  mobileNumber: string
  email: string
  gender: Gender
  age: number
  date: Date
  status: StatusEnum
}
/* eslint-disable-next-line */
export interface AddAppointmentProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Form) => void;
}

const AddAppointment: React.FC<AddAppointmentProps> = ({ open, onClose, onSubmit }) => {


  const validationSchema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    mobileNumber: yup.string().required('Mobile Number is required'),
    email: yup.string().required('Email is required'),
    gender: yup.string().required('Gender is required'),
    status: yup.string().required('status is required'),
    age: yup.number().required('Age is required'),
    date: yup.date().required('Date is Required')
  });

  const { handleSubmit, control, reset, formState: { errors }, watch, setValue } = useForm<Form>({
    resolver: yupResolver(validationSchema),

  });

  const handleFormSubmit = (data: Form) => {
    console.log("handleAddForm:", data)
    onSubmit(data);
  };

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth maxWidth="md"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '' }}>
        <DialogTitle className={styles['h2_tag']} >Add Appointment </DialogTitle>
        <IconButton onClick={() => { onClose(); reset(); }}>
          <CancelIcon></CancelIcon>
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
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
            <Grid item xs={12} md={6} className={styles['grid_top']}>
              <FormControl sx={{ width: '100%' }}>
                <InputLabel htmlFor="gender">Gender</InputLabel>
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
                      <MenuItem sx={{ justifyContent: "start" }} value={GenderEnum.male}>{GenderEnum.male}</MenuItem>
                      <MenuItem sx={{ justifyContent: "start" }} value={GenderEnum.female}>{GenderEnum.female}</MenuItem>
                      <MenuItem sx={{ justifyContent: "start" }} value={GenderEnum.other}>{GenderEnum.other}</MenuItem>
                    </Select>
                  )}
                />
                <FormHelperText sx={{ color: "#d32f2f" }}>{errors.gender?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="date"
                control={control}
                rules={{ required: 'Date of Appointment is required' }}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of Appointment"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          error: !!errors.date,
                          helperText: errors.date?.message,
                          fullWidth: true,
                        },
                      }}
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
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} className={styles['grid_top']}>
              <FormControl sx={{ width: '100%' }}>
                <InputLabel htmlFor="status">Status</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: 'status is required' }}
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
                      label="status*"
                      variant="outlined"
                      {...field}
                      error={!!errors.status}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 100
                          },
                        },
                      }}
                    >
                      <MenuItem sx={{ justifyContent: "start" }} value={StatusEnum.Scheduled}>
                        {StatusEnum.Scheduled}
                      </MenuItem>
                      <MenuItem sx={{ justifyContent: "start" }} value={StatusEnum.InProgress}>
                        {StatusEnum.InProgress}
                      </MenuItem>
                      <MenuItem sx={{ justifyContent: "start" }} value={StatusEnum.Cancelled}>
                        {StatusEnum.Cancelled}
                      </MenuItem>
                      <MenuItem sx={{ justifyContent: "start" }} value={StatusEnum.PendingConfirmation}>
                        {StatusEnum.PendingConfirmation}
                      </MenuItem>
                    </Select>
                  )}
                />
                <FormHelperText sx={{ color: "#d32f2f" }}>{errors.status?.message}</FormHelperText>
              </FormControl>
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

export default AddAppointment;
