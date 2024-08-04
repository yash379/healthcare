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
import { Checkbox, Dialog, FormControlLabel, FormHelperText, FormLabel, Grid, InputAdornment, Radio, RadioGroup } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/system';
import { Gender } from '@prisma/client';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { ViewDoctor } from '@healthcare/data-transfer-types';

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


const EditDoctorComponent: React.FC<EditDoctorProps> = ({ open, onClose, onUpdate, initialData }) => {
  const apiUrl = environment.apiUrl;
  const [totalbuildingValue, setTotalbuildingValue] = useState<number | null>(null);
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const [totalFlatValue, setTotalFlatValue] = useState<number | null>(null);
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



  const { handleSubmit, control, reset, formState: { errors }, setValue, watch } = useForm<ViewDoctor>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...initialData
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
      setValue('doctorCode', initialData?.doctorCode);
      setValue('speciality', initialData?.speciality);
    }
  }, [initialData, setValue]);

  const handleUpdate = (data: ViewDoctor) => {
    onUpdate(data);
    reset();
  };


  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>Edit Doctor</h2>
        <form onSubmit={handleSubmit(handleUpdate)}>
          {/* <Box className={styles['modal_form_containers']}>
            <Box className={styles['modal_first_container']}> */}
          <Grid container xs={11} columnSpacing={5} sx={{ m: 'auto' }}

          >
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
                      sx={{ width: '100%' }}
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
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel htmlFor="doctor">Gender*</InputLabel>
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
                        {/* <FormHelperText>{errors.flats?.type.message}</FormHelperText> */}
                        <MenuItem sx={{ justifyContent: "start" }} value="MALE" >MALE</MenuItem>
                        <MenuItem sx={{ justifyContent: "start" }} value="FEMALE">FEMALE</MenuItem>
                        <MenuItem sx={{ justifyContent: "start" }} value="OTHERS">OTHERS</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText sx={{ color: "#d32f2f" }}>{errors.gender?.message}</FormHelperText>
                </FormControl>
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
                      placeholder="Enter Doctor Last Name"
                      {...field}
                      label="Last Name"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                   
                    />
                  )}
                />
              </Grid>
             
              <Grid item xs={12} md={6} className={styles['grid_top']}>
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
                      label="Doctor Code"
                      error={!!errors.doctorCode}
                      helperText={errors.doctorCode?.message}
                
                    />
                  )}
                />
              </Grid>
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
                      placeholder="Enter Doctor Email"
                      {...field}
                      label="Email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                  
                    />
                  )}
                />
              </Grid>
             

            </Grid>
            <Grid container
              spacing={2}
            >
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

              <Grid item xs={12} md={6} className={styles['grid_spe']}>
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
                      label="Speciality"
                      error={!!errors.speciality}
                      helperText={errors.speciality?.message}
                   
                    />
                  )}
                />
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

export default EditDoctorComponent;
