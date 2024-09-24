/* eslint-disable react/jsx-no-useless-fragment */
import styles from './edit-doctor.module.scss';
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
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/system';
import { Gender } from '@prisma/client';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { ViewDoctor } from '@healthcare/data-transfer-types';
import CancelIcon from '@mui/icons-material/Cancel';

export interface EditDoctorProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: ViewDoctor) => void;
  initialData: ViewDoctor | null;
}

// interface EditForm {
//   firstName: string;
//   lastName: string;
//   email: string;
//   gender: Gender;
//   phoneNumber: string;
//   doctorCode: string;
//   speciality: string;
//   isActive: boolean;
// }

const EditDoctorComponent: React.FC<EditDoctorProps> = ({
  open,
  onClose,
  onUpdate,
  initialData,
}) => {
  const apiUrl = environment.apiUrl;
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const theme = useTheme();
  const [page, setPage] = useState(0);

  const validationSchema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    // phoneNumber: yup.string().matches(/^((\+){0,1}91(\s){0,1}(-){0,1}(\s){0,1}){0,1}9[0-9](\s){0,1}(-){0,1}(\s){0,1}[1-9]{1}[0-9]{7}$/, 'Invalid phone number').required('Phone number is required'),
    gender: yup.string().required('Please Select One'),
    // isActive: yup.boolean().required('Please Select One'),
    doctorCode: yup.string().required('Doctor Code is required'),
    speciality: yup.string().required('Speciality is required'),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ViewDoctor>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...initialData,
    },
  });

  const params = useParams();

  useEffect(() => {
    if (initialData) {
      setValue('firstName', initialData.firstName);
      setValue('lastName', initialData.lastName);
      setValue('email', initialData.email);
      setValue('phoneNumber', initialData.phoneNumber);
      setValue('gender', initialData.gender);
      setValue('doctorCode', initialData?.doctorCode);
      setValue('speciality', initialData?.speciality);
    }
  }, [initialData, setValue]);

  const handleUpdate = (data: ViewDoctor) => {
    onUpdate(data);
    reset();
  };

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
          Edit Doctor
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
          {/* <Box className={styles['modal_form_containers']}>
            <Box className={styles['modal_first_container']}> */}
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
                      sx={{ width: '100%' }}
                      className="form-control"
                      placeholder="Enter Doctor First Name"
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
                      sx={{ width: '100%' }}
                      className="form-control"
                      placeholder="Enter Doctor Last Name"
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
                      sx={{ width: '100%' }}
                      className="form-control"
                      placeholder="Enter Doctor Email"
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
                    />
                  )}
                />
              </Box>
            </Box>
            <Box className={styles['modal_second_container']}>
              <Box className={styles['grid_top']}>
                <Box className={styles['grid_top']}>
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel htmlFor="doctor">
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
                            value="MALE"
                          >
                            MALE
                          </MenuItem>
                          <MenuItem
                            sx={{ justifyContent: 'start' }}
                            value="FEMALE"
                          >
                            FEMALE
                          </MenuItem>
                          <MenuItem
                            sx={{ justifyContent: 'start' }}
                            value="OTHERS"
                          >
                            OTHERS
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
                  <Controller
                    name="doctorCode"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Doctor Code is required' }}
                    render={({ field }) => (
                      <TextField
                        type="text"
                        sx={{ width: '100%' }}
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
                      />
                    )}
                  />
                </Box>
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
                      sx={{ width: '100%' }}
                      className="form-control"
                      placeholder="Enter Doctor Speciality"
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
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>
          {/* <Grid container
              spacing={2}
            > */}
          {/* <Grid item xs={12} md={6} sx={{ mt: '15px' }}>
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Phone Number is required' }}
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
              </Grid> */}

          {/* </Box>
           */}

          {/* </Grid>
          </Grid> */}
          <Box sx={{ mb: '5px', mt: '20px', textAlign: 'end' }}>
          <Button
              variant="contained"
              color="secondary"
              sx={{mr:'10px'}}
              onClick={() => {
                onClose();
                reset();
              }}
            >
              Cancel
            </Button>
            <Button
              className={styles['edit_button']}
              variant="contained"
              color="primary"
              type="submit"
            >
              Save
            </Button>
           
          </Box>
        </form>
      </Box>
    </Dialog>
  );
};

export default EditDoctorComponent;
