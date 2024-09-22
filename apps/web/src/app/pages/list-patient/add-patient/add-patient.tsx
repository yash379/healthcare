/* eslint-disable react/jsx-no-useless-fragment */
import styles from './add-patient.module.scss';
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
import { Checkbox, Dialog, FormControlLabel, FormHelperText, FormLabel, Grid, InputAdornment, Radio, RadioGroup } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Gender } from '@prisma/client';


export interface AddPatientProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Form) => void;
}

interface Form {
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



const AddPatientComponent: React.FC<AddPatientProps> = ({ open, onClose, onSubmit }) => {
  const apiUrl = environment.apiUrl;
  const [totalValue, setTotalValue] = useState<number | null>(null);
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
  const {  handleSubmit, control, reset, formState: { errors }, watch, setValue } = useForm<Form>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      isActive: true
    }
  });
  const params=useParams();

  const handleFormSubmit = (data: Form) => {
    console.log("handleAddForm:", data)
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
    <Modal open={open} onClose={onClose}>
    <Box className={styles['modal-container']}>
      <h2 className={styles['h2_tag']}>Add Patient</h2>
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
        }}
        >
          {/* <Box className={styles['modal_first_container']}> */}

           
          <Box className={styles['modal_second_container']}
          >

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
                rules={{ required: 'Last Name is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    className="form-control"
                    placeholder="Enter Last Name"
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
                name="phoneNumber"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Phone Number is required',
                  // pattern: {
                  //   value: /^[0-9]*$/,
                  //   message: 'Invalid phone number',
                  // },

                }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    inputMode="numeric"
                    className="form-control"
                    placeholder="Enter Phone Number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment sx={{mt:"1px"}} position="start">
                          +91
                        </InputAdornment>
                      ),
                    }}
                    {...field}
                    label="Phone Number*"
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    sx={{ width: '100%' }}
                    
                  />
                )}
              />
            </Box>

            <Box className={styles['grid_top']}>
              <FormControl sx={{ width: '100%' }} error={!!errors.gender}>
                <InputLabel htmlFor="type"  >Gender*</InputLabel>
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
                            maxHeight: 97
                          },
                        },
                      }}
                    >
                      <MenuItem sx={{ justifyContent: "start" }} value="MALE">Male</MenuItem>
                      <MenuItem sx={{ justifyContent: "start" }} value="FEMALE">Female</MenuItem>
                      <MenuItem sx={{ justifyContent: "start" }} value="OTHERS">Others</MenuItem>
                    </Select>

                  )}
                />
                <FormHelperText>{errors.gender?.message}</FormHelperText>
              </FormControl>
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

export default AddPatientComponent;
