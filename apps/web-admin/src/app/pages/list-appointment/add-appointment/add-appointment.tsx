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
import styles from './add-appointment.module.scss';
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
  // firstName: string;
  // lastName: string;
  // mobileNumber: string;
  // email: string;
  // gender: Gender;
  // age: number;
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
    user: yup.object().nullable().required('User is required'),
    date: yup.date().required('Date is required'),
    status: yup.string().required('Status is required'),
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
  const [users, setUsers] = useState<ViewAllUser[]>([]);
  
  const handleFormSubmit = (data: Form) => {
    console.log('handleAddForm:', data);
    onSubmit(data);
  };

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const fetchProjectMembersData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/user/dropdown/list`, {
        withCredentials: true,
      });
      console.log('filter user ', response.data);
      const userMembers = response.data;
      setUsers(userMembers);
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
              {/* <Controller
                // name="user"
                // control={control}
                render={({ field }) => ( */}
                  <Autocomplete
                    // {...field}
                    options={users}
                    getOptionLabel={(option) =>
                      `${option.firstName} ${option.lastName}`
                    }
                    // onChange={(_, data) => field.onChange(data)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search User"
                        placeholder="Search User"
                        // error={!!errors.user}
                        // helperText={errors.user?.message}
                        fullWidth
                      />
                    )}
                  />
                {/* )} */}
              {/* /> */}
            </Box>

            <Box className={styles['grid_top']}>
              <Controller
                name="date"
                control={control}
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
                      sx={{ width: '100%' }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Box>

            <Box>
              <FormControl sx={{ width: '100%' }}>
                <InputLabel htmlFor="status">Status</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      sx={{ width: '100%', marginBottom: 1 }}
                      label="Status*"
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
                      <MenuItem value={StatusEnum.Scheduled}>
                        {StatusEnum.Scheduled}
                      </MenuItem>
                      <MenuItem value={StatusEnum.InProgress}>
                        {StatusEnum.InProgress}
                      </MenuItem>
                      <MenuItem value={StatusEnum.Cancelled}>
                        {StatusEnum.Cancelled}
                      </MenuItem>
                      <MenuItem value={StatusEnum.PendingConfirmation}>
                        {StatusEnum.PendingConfirmation}
                      </MenuItem>
                    </Select>
                  )}
                />
                <FormHelperText sx={{ color: '#d32f2f' }}>
                  {errors.status?.message}
                </FormHelperText>
              </FormControl>
            </Box>
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

export default AddAppointment;
