import { Box, Button, MenuItem, Modal, TextField } from '@mui/material';
import styles from './add-appointment.module.scss';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { useEffect } from 'react';
import { Gender } from '@prisma/client';

export enum GenderEnum {
  female = "female",
  male = "male",
  other = "other",
}


export interface Form {
  firstName: string
  lastName: string
  mobileNumber: string
  email: string
  gender: Gender
  age: number
  date: Date
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
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>Add Appointment</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box sx={{
            display: 'grid',
            columnGap: 2,
            rowGap: 1,
            paddingRight: 3,
            paddingLeft: 3,
            gridTemplateColumns: 'repeat(2, 1fr)',
            '@media (max-width: 600px)': {
              gridTemplateColumns: '1fr',
            },
          }}>
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
                      className="form-control"
                      placeholder="Enter First Name"
                      {...field}
                      label="First Name*"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      sx={{ width: '100%' }}
                    />

                  )}
                />
              </Box>
              <Box className={styles['grid_top']}>
                <Controller
                  name="lastName"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Lst Name is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      className="form-control"
                      placeholder="Enter First Name"
                      {...field}
                      label="Last Name*"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      sx={{ width: '100%' }}
                    />

                  )}
                />
              </Box>
              <Box className={styles['grid_top']}>
                <Controller
                  name="mobileNumber"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Mobile Number is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      className="form-control"
                      placeholder="Enter Mobile number"
                      {...field}
                      label="Mobile Number*"
                      error={!!errors.mobileNumber}
                      helperText={errors.mobileNumber?.message}
                      sx={{ width: '100%' }}
                    />

                  )}
                />
              </Box>
              <Box className={styles['grid_top']}>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Email is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      className="form-control"
                      placeholder="Enter Email"
                      {...field}
                      label="Email*"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{ width: '100%' }}
                    />

                  )}
                />
              </Box>
              <Box className={styles['grid_top']}>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: 'gender is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      className="form-control"
                      placeholder="Enter gender"
                      {...field}
                      label="gender*"
                      error={!!errors.gender}
                      helperText={errors.gender?.message}
                      sx={{ width: '100%' }}
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
                      className="form-control"
                      placeholder="Enter age"
                      {...field}
                      label="age*"
                      error={!!errors.age}
                      helperText={errors.age?.message}
                      sx={{ width: '100%' }}
                    />

                  )}
                />
              </Box>
              <Box className={styles['grid_top']}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker label="Basic date picker" />
                  </DemoContainer>
                </LocalizationProvider>
              </Box>
            </Box>

          </Box>

          <Box className={styles['update_modal-buttons']}>
          <Button sx={{ mr: "10px" }} variant="contained" color="primary" type="submit">
             Add
          </Button>
          <Button variant="contained" color="secondary" onClick={()=>{onClose(); reset()}}>
            Cancel
          </Button>
        </Box>



        </form>
      </Box>
    </Modal>
  );
}

export default AddAppointment;
