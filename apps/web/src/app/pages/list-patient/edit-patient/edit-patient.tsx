/* eslint-disable react/jsx-no-useless-fragment */
import styles from './edit-patient.module.scss';
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
import { Checkbox, Dialog, FormControlLabel, FormHelperText, FormLabel, Grid, InputAdornment, Radio, RadioGroup } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/system';
import { Gender } from '@prisma/client';

export interface EditPatientProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: EditForm) => void;
  initialData: EditForm | null;
}


interface EditForm {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  gender: Gender;
  bloodgroup: string;
  dob: Date;
  digitalHealthCode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  isActive: boolean;
}


const EditPatientComponent: React.FC<EditPatientProps> = ({ open, onClose, onUpdate, initialData }) => {
  const apiUrl = environment.apiUrl;
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const theme = useTheme();
  const [page, setPage] = useState(0);

  const validationSchema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup.string().matches(/[6789][0-9]{9}/, 'Invalid phone number').min(10).max(10).required('Phone number is required'),
    gender: yup.boolean().required('Please Select One'),
    isActive: yup.boolean().required('Please Select One'),
    bloodgroup: yup.string().required('Blood Group is required'),
    dob: yup.date().required('Date Of Birth is required'),
    digitalHealthCode: yup.string().required('Digital Health Code is required'),
    addressLine1: yup.string().required('addressLine1 is required'),
    addressLine2: yup.string().notRequired(),
    city: yup.string().required('City is required'),
    stateCode: yup.string().required('State Code is required'),
    countryCode: yup.string().required('Country Code is required'),
    postalCode: yup.string().required('Postal Code is required'),
  });



  const { handleSubmit, control, reset, formState: { errors }, setValue, watch } = useForm<EditForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...initialData,
      isActive: true
    }
  });


  const params = useParams();


  useEffect(() => {
    if (initialData) {
      setValue('firstName', initialData.firstName);
      setValue('lastName', initialData.lastName);
      setValue('email', initialData.email);
      setValue('phoneNumber', initialData.phoneNumber);
      setValue('gender', initialData.gender);
      setValue('bloodgroup', initialData?.bloodgroup);
      setValue('dob', initialData?.dob);
      setValue('digitalHealthCode', initialData?.digitalHealthCode);
      setValue('addressLine1', initialData?.addressLine1);
      setValue('addressLine2', initialData?.addressLine2);
      setValue('city', initialData?.city);
      setValue('stateCode', initialData?.stateCode);
      setValue('countryCode', initialData?.countryCode);
      setValue('postalCode', initialData?.postalCode);
    }
  }, [initialData, setValue]);

  const handleUpdate = (data: EditForm) => {
    onUpdate(data);
    reset();
  };


  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>Edit Patient</h2>
        <form onSubmit={handleSubmit(handleUpdate)}>
          {/* <Box className={styles['modal_form_containers']}>
            <Box className={styles['modal_first_container']}> */}
          <Grid container xs={11} columnSpacing={5} sx={{ m: 'auto' }}

          >
            <Grid container spacing={2}>

              <Grid item xs={12} md={6} className={styles['grid_top']}>
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
                      placeholder="Enter Patient Email"
                      {...field}
                      label="Email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      disabled
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6} className={styles['grid_top']}>
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
                      placeholder="Enter Patient First Name"
                      {...field}
                      label="First Name"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      disabled
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6} className={styles['grid_top']}>
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
                      placeholder="Enter Patient Last Name"
                      {...field}
                      label="Last Name"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      disabled
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6} className={styles['grid_top']}>
                <Controller
                  name="bloodgroup"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Blood Group is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      sx={{ width: '100%' }}
                      className="form-control"
                      placeholder="Enter Blood Group"
                      {...field}
                      label="Blood Group"
                      error={!!errors.bloodgroup}
                      helperText={errors.bloodgroup?.message}
                      disabled
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6} className={styles['grid_top']}>
                <Controller
                  name="digitalHealthCode"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Digital Health Code is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      sx={{ width: '100%' }}
                      className="form-control"
                      placeholder="Enter Patient Digital Health Code"
                      {...field}
                      label="Digital Health Code"
                      error={!!errors.digitalHealthCode}
                      helperText={errors.digitalHealthCode?.message}
                      disabled
                    />
                  )}
                />
              </Grid>

            </Grid>
            <Grid container
              spacing={2}
            >
              <Grid item xs={12} md={6} sx={{ mt: '15px' }}>
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Phone Number is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      inputMode="numeric"
                      sx={{ width: '100%' }}
                      className="form-control"
                      placeholder="Enter Patient Phone Number"
                      {...field}
                      label="Phone Number"
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment sx={{ mt: "1px" }} position="start">
                            +91
                          </InputAdornment>
                        ),
                      }}
                      disabled
                    />
                  )}
                />
              </Grid>


              <Grid item xs={12} md={6} className={styles['grid_top']}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel htmlFor="patient">Gender*</InputLabel>
                  <Controller
                    name="gender"
                    control={control}
                    // defaultValue=""
                    rules={{ required: 'Gender is required' }}
                    render={({ field }) => (
                      <Select
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
                        <MenuItem sx={{ justifyContent: "start" }} value="MALE" >MALE</MenuItem>
                        <MenuItem sx={{ justifyContent: "start" }} value="FEMALE">FEMALE</MenuItem>
                        <MenuItem sx={{ justifyContent: "start" }} value="OTHERS">OTHERS</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText sx={{ color: "#d32f2f" }}>{errors.gender?.message}</FormHelperText>
                </FormControl>
              </Grid>
    
              {/* </Box>
             */}




            </Grid>
          </Grid>
          <Box className={styles['update_modal-buttons']}>
            <Button className={styles['edit_button']} variant="contained" color="primary" type="submit" >
              Save
            </Button>
            <Button variant="contained" color="secondary" onClick={() => { onClose(); reset() }}>
              Cancel
            </Button>
          </Box>
        </form >
      </Box >
    </Modal>
  );
}

export default EditPatientComponent;
