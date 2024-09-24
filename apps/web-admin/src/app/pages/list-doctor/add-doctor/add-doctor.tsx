/* eslint-disable react/jsx-no-useless-fragment */
import styles from './add-doctor.module.scss';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { environment } from '../../../../environments/environment';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Checkbox,
  Dialog,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { Gender } from '@prisma/client';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import CancelIcon from '@mui/icons-material/Cancel';

export interface AddDoctorProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Form) => void;
}

interface Form {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  phoneNumber: string;
  doctorCode: string;
  speciality: string;
  isActive: boolean;
}

interface EditForm {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  phoneNumber: string;
  doctorCode: string;
  speciality: string;
  isActive: boolean;
}

const AddDoctorComponent: React.FC<AddDoctorProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const apiUrl = environment.apiUrl;
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  const validationSchema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    // phoneNumber: yup.string().matches(/[6789][0-9]{9}/, 'Invalid phone number').min(10).max(10).required('Phone number is required'),
    gender: yup.string().required('Please Select One'),
    isActive: yup.boolean().required('Please Select One'),
    doctorCode: yup.string().required('Doctor Code is required'),
    speciality: yup.string().required('Speciality is required'),
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
    defaultValues: {
      isActive: true,
    },
  });


  const params = useParams();

  const handleFormSubmit = (data: Form) => {
    console.log('handleAddForm:', data);
    onSubmit(data);
  };

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);
  // useEffect(() => {
  //   if (initialData) {
  //     // setValue('name', initialData.name);
  //     // setValue('email', initialData.email);
  //     // setValue('phoneNumber', initialData.phoneNumber);

  //   }
  // }, [initialData, setValue]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
          Add Doctor
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
                      className="form-control"
                      // placeholder="Enter First Name"
                      {...field}
                      label={
                        <Box sx={{ display: 'flex' }}>
                          First Name
                          <Typography
                            fontSize="medium"
                            color="error"
                            sx={{ ml: '3px', mb: '10px' }}
                          >
                            *
                          </Typography>
                        </Box>
                      }
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
                  rules={{ required: 'Last Name is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      className="form-control"
                      placeholder="Enter Last Name"
                      {...field}
                      label={
                        <Box sx={{ display: 'flex' }}>
                          Last Name
                          <Typography
                            fontSize="medium"
                            color="error"
                            sx={{ ml: '3px', mb: '10px' }}
                          >
                            *
                          </Typography>
                        </Box>
                      }
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
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
                      type="email"
                      className="form-control"
                      placeholder="Enter Email"
                      {...field}
                      label={
                        <Box sx={{ display: 'flex' }}>
                          Email Address
                          <Typography
                            fontSize="medium"
                            color="error"
                            sx={{ ml: '3px' }}
                          >
                            *
                          </Typography>
                        </Box>
                      }
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{ width: '100%' }}
                    />
                  )}
                />
              </Box>
              {/* <Box className={styles['grid_top']}>
              <Controller
                name="phoneNumber"
                control={control}
                defaultValue=""
                // rules={{
                //   required: 'Phone Number is required',
                // }}
                render={({ field }) => (
                  <PhoneInput
                  {...field}   
                  inputStyle={{
                    borderColor: (errors.phoneNumber) && "#de0835",
                    boxSizing: 'inherit',
                    height: '55px',
                    width: '82%',
                    maxWidth:"524px"                      
                  }}                                                                                                     
                  country={'in'}
                  value={field.value}
                  onChange={(phone: any) => field.onChange(phone)}
                
                /> 
                )}
              />
            </Box> */}
            </Box>
            <Box className={styles['modal_second_container']}>
              <Box className={styles['grid_top']}>
                <FormControl sx={{ width: '100%' }} error={!!errors.gender}>
                  <InputLabel htmlFor="type">
                    {
                      <Box sx={{ display: 'flex' }}>
                        Gender
                        <Typography
                          fontSize="medium"
                          color="error"
                          sx={{ ml: '3px' }}
                        >
                          *
                        </Typography>
                      </Box>
                    }
                  </InputLabel>
                  <Controller
                    name="gender"
                    control={control}
                    // defaultValue=""
                    rules={{ required: 'Gender is required' }}
                    render={({ field }) => (
                      <Select
                        label={
                          <Box sx={{ display: 'flex' }}>
                            Gender
                            <Typography
                              fontSize="medium"
                              color="error"
                              sx={{ ml: '3px' }}
                            >
                              *
                            </Typography>
                          </Box>
                        }
                        variant="outlined"
                        {...field}
                        error={!!errors.gender}
                        // MenuProps={{
                        //   PaperProps: {
                        //     style: {
                        //       maxHeight: 97
                        //     },
                        //   },
                        // }}
                      >
                        <MenuItem sx={{ justifyContent: 'start' }} value="MALE">
                          Male
                        </MenuItem>
                        <MenuItem
                          sx={{ justifyContent: 'start' }}
                          value="FEMALE"
                        >
                          Female
                        </MenuItem>
                        <MenuItem
                          sx={{ justifyContent: 'start' }}
                          value="OTHERS"
                        >
                          Others
                        </MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText>{errors.gender?.message}</FormHelperText>
                </FormControl>
              </Box>
              <Box className={styles['grid_top']}>
                <Controller
                  name="doctorCode"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Doctor Code is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      className="form-control"
                      placeholder="Enter Doctor Code"
                      {...field}
                      label={
                        <Box sx={{ display: 'flex' }}>
                          Doctor Code
                          <Typography
                            fontSize="medium"
                            color="error"
                            sx={{ ml: '3px' }}
                          >
                            *
                          </Typography>
                        </Box>
                      }
                      error={!!errors.doctorCode}
                      helperText={errors.doctorCode?.message}
                      sx={{ width: '100%' }}
                    />
                  )}
                />
              </Box>
              <Box className={styles['grid_top']}>
                <Controller
                  name="speciality"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Speciality is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      className="form-control"
                      placeholder="Enter Speciality"
                      {...field}
                      label={
                        <Box sx={{ display: 'flex' }}>
                          Speciality
                          <Typography
                            fontSize="medium"
                            color="error"
                            sx={{ ml: '3px' }}
                          >
                            *
                          </Typography>
                        </Box>
                      }
                      error={!!errors.speciality}
                      helperText={errors.speciality?.message}
                      sx={{ width: '100%' }}
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>

          <Box sx={{ mb: '5px', mt: '20px', textAlign: 'end' }}>
            <Button
              sx={{ mr: '10px' }}
              variant="contained"
              color="secondary"
              onClick={() => {
                onClose();
                reset();
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Add
            </Button>
          </Box>
        </form>
      </Box>
    </Dialog>
  );
};

export default AddDoctorComponent;
