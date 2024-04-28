import styles from './add-patient-page.module.scss';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Icon,
  Typography,
  FormHelperText,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { environment } from '../../../../environments/environment';
import Breadcrumbs from '../../../Components/bread-crumbs/bread-crumbs';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CountriesStates } from '../../../core/consts/countries-states';

import { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { HospitalContext } from '../../../contexts/user-context';
import { Gender } from '@prisma/client';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export interface AddPatient {
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

/* eslint-disable-next-line */
export interface AddPatientPageProps { }

export function AddPatientPage(props: AddPatientPageProps) {
  const [country, setCountry] = useState<string>('');

  const apiUrl = environment.apiUrl;
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const hospitalContext=useContext(HospitalContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessSnackbarOpen, setIsSuccessSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const validationSchema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup.string().matches(/[6789][0-9]{9}/, 'Invalid phone number').required('Phone number is required'),
    gender: yup.string().required('Please Select One'),
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
  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<AddPatient>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      stateCode: '',
      isActive: true,
    },
  });

  const countryValue = watch('countryCode');

  console.log("hospitalcontext : ", hospitalContext)
  
  // Add Patient
  const handleAddPatient = async (formData: AddPatient) => {

    try {
      const { data: responseData } = await axios.post(`${apiUrl}/hospitals/${hospitalContext?.id}/patients`,
        { firstName: formData.firstName, lastName: formData.lastName, gender: formData.gender,  email: formData.email, phoneNumber: formData.phoneNumber , bloodgroup: formData.bloodgroup, dob:formData.dob, digitalHealthCode:formData.digitalHealthCode, addressLine1:formData.addressLine1, addressLine2:formData.addressLine2, city:formData.city, stateCode:formData.stateCode, countryCode:formData.countryCode, postalCode:formData.postalCode, isActive: formData.isActive },
        {
          withCredentials: true,

        },)
      if (responseData) {
        reset();
        enqueueSnackbar("Patient added successfully!", { variant: 'success' });
        navigate(`/dashboard/${hospitalContext?.id}`);
        // setIsAddModalOpen(false);
        // getPatients();

      } else {
        console.log("Something went wrong")
      }

    } catch (error) {
      console.log(error);
      console.log("Something went wrong in input form")
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  }

  const stateOptions =
    CountriesStates.find((c) => c.code === countryValue)?.states || [];
  const breadcrumbs = [
    {
      to: `/dashboard/${hospitalContext?.id}`,
      label: 'Dashboard',
    },
    { to: `/hospital/${hospitalContext?.id}/patients`, label: 'Patients' },
    {
      label: 'Add',
    },
  ];

  return (
    <>
      <Breadcrumbs paths={breadcrumbs} />
      <div className={styles['container']}>
        <Typography variant="h1" sx={{ my: '20px' }}>
          <Icon component={AddIcon} /> Add Patient
        </Typography>
        <form onSubmit={handleSubmit(handleAddPatient)}>
          <div className={styles['form-row']}>
            <div className={styles['form-item']}>
              <Controller
                name="digitalHealthCode"
                control={control}
                defaultValue=""
                rules={{ required: 'Digital Health Code is required' }}
                render={({ field }) => (
                  <TextField
                    label="Digital Health Code*"
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.digitalHealthCode}
                    helperText={errors.digitalHealthCode?.message}
                  />
                )}
              />
            </div>
            <div className={styles['form-item']}>
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
            </div>

          </div>
          <div className={styles['form-row']}>
            <div className={styles['form-item']}>
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
            </div>
            <div className={styles['form-item']}>
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
            </div>
            </div>
            <div className={styles['form-row']}>
            <div className={styles['form-item']}>
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
                  // <TextField
                  //   type="text"
                  //   inputMode="numeric"
                  //   className="form-control"
                  //   placeholder="Enter Phone Number"
                  //   InputProps={{
                  //     startAdornment: (
                  //       <InputAdornment sx={{mt:"1px"}} position="start">
                  //         +91
                  //       </InputAdornment>
                  //     ),
                  //   }}
                  //   {...field}
                  //   label="Phone Number*"
                  //   error={!!errors.phoneNumber}
                  //   helperText={errors.phoneNumber?.message}
                  //   sx={{ width: '100%' }}
                    
                  // />
                  <PhoneInput
                  {...field}   
                  inputStyle={{
                    borderColor: (errors.phoneNumber) && "#de0835",
                    boxSizing: 'inherit',
                    height: '55px',
                    width: '100%',
                    maxWidth:"524px"                      
                  }}                                                                                                     
                  country={'in'}
                  value={field.value}
                  onChange={(phone: any) => field.onChange(phone)}
                  // error={!!errors.phoneNumber}
                  // helperText={errors.phoneNumber?.message}
                /> 
                )}
              />
              {!!errors.phoneNumber && <Typography sx={{color:'#de0835',fontSize:[13,"!important"],marginLeft:'13px'}} >{errors.phoneNumber.message}</Typography>} 
            </div>
            <div className={styles['form-item']}>
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
                {/* <FormHelperText>{errors.gender?.message}</FormHelperText> */}
              </FormControl>
            </div>

          </div>
          <div className={styles['form-row']}>
            <div className={styles['form-item']}>
              <Controller
                name="bloodgroup"
                control={control}
                defaultValue=""
                rules={{ required: 'Blood Group is required' }}
                render={({ field }) => (
                  <TextField
                    label="Blood Group*"
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.bloodgroup}
                    helperText={errors.bloodgroup?.message}
                  />
                )}
              />
            </div>
            <div className={styles['form-item']}>
            <Controller
                      name="dob"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            {...field}
                            label="DOB"
                            slotProps={{
                              textField: {
                                error: !!error,
                                helperText: error?.message,
                                fullWidth: true,
                              },
                            }}
                          />
                        </LocalizationProvider>
                      )}
                    />
            </div>

          </div>
          <div className={styles['form-row']}>
            <div className={styles['form-item']}>
              <Controller
                name="addressLine1"
                control={control}
                defaultValue=""
                rules={{ required: 'Address_line1 is required' }}
                render={({ field }) => (
                  <TextField
                    label="Address 1*"
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.addressLine1}
                    helperText={errors.addressLine1?.message}
                  />
                )}
              />
            </div>
            <div className={styles['form-item']}>
              <Controller
                name="addressLine2"
                control={control}
                defaultValue=""
                rules={{ required: 'address_line2 is required' }}
                render={({ field }) => (
                  <TextField
                    label="Address 2"
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.addressLine2}
                    helperText={errors.addressLine2?.message}
                  />
                )}
              />
            </div>
           
          </div>

          <div className={styles['form-row']}>
          <div className={styles['form-item']}>
              <Controller
                name="city"
                control={control}
                defaultValue=""
                rules={{ required: 'City is required' }}
                render={({ field }) => (
                  <TextField
                    label="City*"
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
              />
            </div>
            <div className={styles['form-item']}>
              <Controller
                name="countryCode"
                control={control}
                defaultValue={""}
                render={({ field }) => (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Country*</InputLabel>
                    <Select
                      {...field}
                      label="Country*"
                      value={field.value || ""}
                      error={!!errors.countryCode}
              
                    >
                      {CountriesStates.map((countryData, index) => (
                        <MenuItem key={index} value={countryData.code} >
                          {countryData.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <FormHelperText sx={{ ml: "12px", color: "#d32f2f" }}>{errors.countryCode?.message}</FormHelperText>
            </div>
           
          </div>
          <div className={styles['form-row']}>
          <div className={styles['form-item']}>
              <Controller
                name="stateCode"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>State</InputLabel>
                    <Select {...field} label="State*">
                      {stateOptions.map((stateData, index) => (
                        <MenuItem key={index} value={stateData.code}>
                          {stateData.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>
            <div className={styles['form-item']}>
              <Controller
                name="postalCode"
                control={control}
                defaultValue=""
                rules={{ required: 'postalcode is required' }}
                render={({ field }) => (
                  <TextField
                    label="Postal Code*"
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.postalCode}
                    helperText={errors.postalCode?.message}
                  />
                )}
              />
            </div>

          </div>
          <div className={styles['form-row']}>
            <div className={styles['form-item']}>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
            </div>
          </div>
        </form>

      </div>
    </>
  );
}

export default AddPatientPage;
