import {
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
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import styles from './add-appointment.module.scss';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { useEffect } from 'react';
import { Gender } from '@prisma/client';
import CancelIcon from '@mui/icons-material/Cancel';

export enum GenderEnum {
  female = 'female',
  male = 'male',
  other = 'other',
}

export enum StatusEnum {
  Scheduled = "Scheduled",
  InProgress = "In Progress",
  Cancelled = "Cancelled",
  PendingConfirmation = "Pending Confirmation",
}

export interface Form {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  gender: Gender;
  age: number;
  date: Date;
  status: StatusEnum;
}
/* eslint-disable-next-line */
export interface AddAppointmentProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Form) => void;
}

const AddAppointment: React.FC<AddAppointmentProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const validationSchema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    mobileNumber: yup.string().required('Mobile Number is required'),
    email: yup.string().required('Email is required'),
    gender: yup.string().required('Gender is required'),
    status: yup.string().required('status is required'),
    age: yup.number().required('Age is required'),
    date: yup.date().required('Date is Required'),
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

  const handleFormSubmit = (data: Form) => {
    console.log('handleAddForm:', data);
    onSubmit(data);
  };

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
        <Box
          sx={{
            display: 'grid',
            columnGap: 2,
            rowGap: 1,
            gridTemplateColumns: 'repeat(2, 1fr)',
            '@media (max-width: 600px)': {
              gridTemplateColumns: '1fr',
            },
          }}
        >
          <Box className={styles['modal_first_container']}>
            <Box className={styles['grid_top']}>
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
            </Box>
            <Box className={styles['grid_top']}>
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
            </Box>
            <Box className={styles['grid_top']}>
            <Controller
              name="age"
              control={control}
              rules={{ required: 'age is required' }}
              render={({ field }) => (
                <TextField
                  type="text"
                  sx={{
                    width: '100%',
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
            </Box>
            <Box className={styles['grid_top']}>
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
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Box>
          {/* </Box> */}
          </Box>
          <Box className={styles['modal_second_container']}>
            <Box className={styles['grid_top']}>
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

          </Box>
          <Box className={styles['grid_top']}>
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

          </Box>
          <Box className={styles['grid_top']}>
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
                    }}
                    label="Gender*"
                    variant="outlined"
                    {...field}
                    error={!!errors.gender}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 100,
                        },
                      },
                    }}
                  >
                    <MenuItem
                      sx={{ justifyContent: 'start' }}
                      value={GenderEnum.male}
                    >
                      {GenderEnum.male}
                    </MenuItem>
                    <MenuItem
                      sx={{ justifyContent: 'start' }}
                      value={GenderEnum.female}
                    >
                      {GenderEnum.female}
                    </MenuItem>
                    <MenuItem
                      sx={{ justifyContent: 'start' }}
                      value={GenderEnum.other}
                    >
                      {GenderEnum.other}
                    </MenuItem>
                  </Select>
                )}
              />
              <FormHelperText sx={{ color: '#d32f2f' }}>
                {errors.gender?.message}
              </FormHelperText>
            </FormControl>
          </Box>

          <Box className={styles['grid_top']}>
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
                    }}
                    label="status*"
                    variant="outlined"
                    {...field}
                    error={!!errors.status}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 100,
                        },
                      },
                    }}
                  >
                    <MenuItem
                      sx={{ justifyContent: 'start' }}
                      value={StatusEnum.scheduled}
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
          <Button sx={{ml:'10px'}} variant="contained" color="primary" type="submit">
            Save
          </Button>
        </Box>
      </form>
      </Box>
    </Dialog>
  );
};

export default AddAppointment;
