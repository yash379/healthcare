import styles from './add-patient-page.module.scss';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate, useParams } from 'react-router-dom';
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
  Grid,
  Autocomplete,
  Chip, // Import Grid component
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
import { HospitalContext } from '../../../contexts/hospital-context';
import { AcuteDisease, ChronicDisease, Gender } from '@prisma/client';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import DoctorContext from '../../../contexts/doctor-context';
// import { AddPatient } from '@healthcare/data-transfer-types';

// const AcuteDisease = [
//   "FLU",
//   "PNEUMONIA",
//   "APPENDICITIS",
//   "MIGRAINE"
// ];
// const ChronicDisease = [
//   "DIABETES",
//   "HYPERTENSION",
//   "ASTHMA",
//   "COPD"
// ];

export interface AddPatient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  gender: Gender;
  age: number;
  bloodGroup: string;
  dob: Date | null;
  digitalHealthCode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  chronicDisease?: ChronicDisease[]; // Array of ChronicDisease enums
  acuteDisease?: AcuteDisease[]; // Array of AcuteDisease enums
  isActive: boolean;
}

/* eslint-disable-next-line */
export interface AddPatientPageProps {}

export function AddPatientPage(props: AddPatientPageProps) {
  const [country, setCountry] = useState<string>('');
  const params = useParams();
  const apiUrl = environment.apiUrl;
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const hospitalContext = useContext(HospitalContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessSnackbarOpen, setIsSuccessSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const validationSchema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup
      .string()
      .matches(/[6789][0-9]{9}/, 'Invalid phone number')
      .min(10)
      .max(10)
      .required('Phone number is required'),
    gender: yup.string().required('Please Select One'),
    isActive: yup.boolean().required('Please Select One'),
    bloodGroup: yup.string().required('Blood Group is required'),
    dob: yup.date().required('Date Of Birth is required'),
    digitalHealthCode: yup.string().required('Digital Health Code is required'),
    addressLine1: yup.string().required('Address Line 1 is required'),
    addressLine2: yup.string().notRequired(),
    city: yup.string().required('City is required'),
    // stateCode: yup.string().required('State Code is required'),
    stateCode: yup.string().notRequired(),
    countryCode: yup.string().required('Country Code is required'),
    postalCode: yup.string().required('Postal Code is required'),
    age: yup
      .number()
      .required('Age is required')
      .min(0, 'Age cannot be less than 0')
      .max(200, 'Age cannot be Greater then 200'),
    chronicDisease: yup
      .array()
      .of(yup.string().required('Each chronic disease must be a valid string'))
      .min(1, 'At least one chronic disease is required')
      .required('chronicDiseases is required'),

    acuteDisease: yup
      .array()
      .of(yup.string().required('Each acute disease must be a valid string'))
      .min(1, 'At least one acute disease is required')
      .required('acuteDiseases is required'),
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

  const doctorContext=useContext(DoctorContext);

  const countryValue = watch('countryCode');
  const chronicDiseaseOptions = Object.values(ChronicDisease);
  const acuteDiseaseOptions = Object.values(AcuteDisease);
  console.log('hospitalcontext : ', hospitalContext);

  // Add Patient
  const handleAddPatient = async (formData: AddPatient) => {
    try {
      const { data: responseData } = await axios.post(
        `${apiUrl}/hospitals/${hospitalContext?.hospital?.id}/doctors/${params.doctorId}/patient`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          bloodGroup: formData.bloodGroup,
          dob: formData.dob ? formData.dob.toISOString() : undefined,
          // dob:'2024-09-03T17:54:34.885Z',
          digitalHealthCode: formData.digitalHealthCode,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          stateCode: formData.stateCode,
          countryCode: formData.countryCode,
          postalCode: formData.postalCode,
          isActive: formData.isActive,
          age: formData.age,
          chronicDiseases: formData.chronicDisease,
          acuteDiseases: formData.acuteDisease,
        },
        {
          withCredentials: true,
        }
      );
      if (responseData) {
        reset();
        enqueueSnackbar('Patient added successfully!', { variant: 'success' });
        navigate(`/hospitals/${hospitalContext?.hospital?.id}/doctors/${doctorContext?.doctor?.id}/patients`);
      } else {
        console.log('Something went wrong');
      }
    } catch (error) {
      console.log(error);
      console.log('Something went wrong in input form');
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  const stateOptions =
    CountriesStates.find((c) => c.code === countryValue)?.states || [];
  const breadcrumbs = [
    {
      to: `/hospitals/${hospitalContext?.hospital?.id}/doctors/${doctorContext?.doctor?.id}`,
      label: 'Home',
    },
    { to: `/hospitals/${hospitalContext?.hospital?.id}/doctors/${doctorContext?.doctor?.id}/patients`, label: 'Patients' },
    {
      label: 'Add',
    },
  ];

  return (
    <>
      <Breadcrumbs paths={breadcrumbs} />
      <div className={styles['container']} style={{marginTop: '20px',}}>
        <Typography variant="h1" style={{ marginTop: '30px', marginLeft: '35px' }}>
          Add Patient
        </Typography>
        <div style={{marginRight: '40px', marginLeft: '20px'}}>
        <form onSubmit={handleSubmit(handleAddPatient)}>
          <Grid container rowSpacing={3} columnSpacing={4} >
            <Grid item lg={6} sm={5}>
              <Controller
                name="digitalHealthCode"
                control={control}
                defaultValue=""
                rules={{ required: 'Digital Health Code is required' }}
                render={({ field }) => (
                  <TextField
                    label="Digital Health Code*"
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                    }}
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.digitalHealthCode}
                    helperText={errors.digitalHealthCode?.message}
                  />
                )}
              />
            </Grid>
            <Grid item lg={6} sm={5}>
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
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item lg={6} sm={5}>
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
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                    }}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item lg={6} sm={5}>
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
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item lg={6} sm={5}>
              <Controller
                name="phoneNumber"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Phone Number is required',
                }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    inputMode="numeric"
                    className="form-control"
                    placeholder="Enter Phone Number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment sx={{ mt: '1px' }} position="start">
                          +91
                        </InputAdornment>
                      ),
                    }}
                    {...field}
                    label="Phone Number*"
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item lg={6} sm={5}>
              <Controller
                name="gender"
                control={control}
                rules={{ required: 'Gender is required' }}
                render={({ field }) => (
                  <FormControl
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                    }}
                    error={!!errors.gender}
                  >
                    <InputLabel>Gender</InputLabel>
                    <Select {...field} label="Gender*">
                      {Object.keys(Gender).map((gender, i) => (
                        <MenuItem key={i} value={gender}>
                          {gender}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.gender?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item lg={6} sm={5}>
              {/* <Controller
                name="dob"
                control={control}
                rules={{ required: 'Date of Birth is required' }}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of Birth*"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          error: !!errors.dob,
                          helperText: errors.dob?.message,
                          fullWidth: true,
                        },
                      }}
                      sx={{
                        width: '100%',
                        marginBottom: 1,
                      }}
                    />
                  </LocalizationProvider>
                )}
              /> */}
              <Controller
                name="dob"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      label="Date of Birth"
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
            </Grid>
            <Grid item lg={6} sm={5}>
              <Controller
                name="bloodGroup"
                control={control}
                defaultValue=""
                rules={{ required: 'Blood Group is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    className="form-control"
                    placeholder="Enter Blood Group"
                    {...field}
                    label="Blood Group*"
                    error={!!errors.bloodGroup}
                    helperText={errors.bloodGroup?.message}
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item lg={6} sm={5}>
              <Controller
                name="age"
                control={control}
                defaultValue={0}
                rules={{
                  required: 'Age is required',
                  min: {
                    value: 0,
                    message: 'Age cannot be less than 0',
                  },
                  max: {
                    value: 200,
                    message: 'Age cannot be Greater than 200',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    type="number"
                    className="form-control"
                    placeholder="Enter Age"
                    {...field}
                    label="Age*"
                    error={!!errors.age}
                    helperText={errors.age?.message}
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                    }}
                    inputProps={{
                      min: 0, // Set minimum value for the input
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item lg={6} sm={5}>
              <Controller
                name="addressLine1"
                control={control}
                defaultValue=""
                rules={{ required: 'Address Line 1 is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    className="form-control"
                    placeholder="Enter Address Line 1"
                    {...field}
                    label="Address Line 1*"
                    error={!!errors.addressLine1}
                    helperText={errors.addressLine1?.message}
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item lg={6} sm={5}>
              <Controller
                name="addressLine2"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    type="text"
                    className="form-control"
                    placeholder="Enter Address Line 2"
                    {...field}
                    label="Address Line 2"
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item lg={6} sm={5}>
              <Controller
                name="city"
                control={control}
                defaultValue=""
                rules={{ required: 'City is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    className="form-control"
                    placeholder="Enter City"
                    {...field}
                    label="City*"
                    error={!!errors.city}
                    helperText={errors.city?.message}
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item lg={6} sm={5}>
              <Controller
                name="countryCode"
                control={control}
                defaultValue=""
                rules={{ required: 'Country is required' }}
                render={({ field }) => (
                  <FormControl
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                    }}
                    error={!!errors.countryCode}
                  >
                    <InputLabel>Country*</InputLabel>
                    <Select {...field} label="Country*">
                      {CountriesStates.map((country, i) => (
                        <MenuItem key={i} value={country.code}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.countryCode?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item lg={6} sm={5}>
              <Controller
                name="stateCode"
                control={control}
                defaultValue=""
                rules={{ required: 'State is required' }}
                render={({ field }) => (
                  <FormControl
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                    }}
                    error={!!errors.stateCode}
                  >
                    <InputLabel>State*</InputLabel>
                    <Select {...field} label="State*">
                      {stateOptions.map((s) => (
                        <MenuItem key={s.code} value={s.code}>
                          {s.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.stateCode?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item lg={6} sm={5}>
              <Controller
                name="postalCode"
                control={control}
                defaultValue=""
                rules={{ required: 'Postal Code is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    className="form-control"
                    placeholder="Enter Postal Code"
                    {...field}
                    label="Postal Code*"
                    error={!!errors.postalCode}
                    helperText={errors.postalCode?.message}
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item lg={6} sm={5}>
              {/* <Controller
                name="chronicDisease"
                control={control}
                rules={{ required: 'chronicDisease is required' }}
                render={({ field }) => (
                  <FormControl
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                    }}
                    error={!!errors.chronicDisease}
                  >
                    <InputLabel>ChronicDisease</InputLabel>
                    <Select {...field} label="chronicDisease*">
                      {Object.keys(ChronicDisease).map((chronicDisease, i) => (
                        <MenuItem key={i} value={chronicDisease}>
                          {chronicDisease}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.chronicDisease?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              /> */}
              <FormControl
                sx={{ width: '100%', marginBottom: 2 }}
                error={!!errors.chronicDisease}
              >
                <Controller
                  name="chronicDisease"
                  control={control}
                  rules={{ required: 'ChronicDiseases is required' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      options={chronicDiseaseOptions}
                      renderTags={(value: string[], getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Select Chronic Diseases"
                          placeholder="Chronic Diseases"
                          error={!!errors.chronicDisease}
                        />
                      )}
                      onChange={(_, value) =>
                        field.onChange(value.map((v) => v.toUpperCase()))
                      } // Important: Update field value
                    />
                  )}
                />
                <FormHelperText>
                  {errors.chronicDisease?.message}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item lg={6} sm={5}>
              <FormControl
                sx={{ width: '100%', marginBottom: 2 }}
                error={!!errors.acuteDisease}
              >
                <Controller
                  name="acuteDisease"
                  control={control}
                  rules={{ required: 'Acute Disease is required' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      options={acuteDiseaseOptions}
                      renderTags={(value: string[], getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Select Acute Diseases"
                          placeholder="Acute Diseases"
                          error={!!errors.acuteDisease}
                        />
                      )}
                      onChange={(_, value) =>
                        field.onChange(value.map((v) => v.toUpperCase()))
                      }
                    />
                  )}
                />
                <FormHelperText>{errors.acuteDisease?.message}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mb: 2, width: '20%' }}
          >
            Submit
          </Button>
        </form>
        </div>
      </div>
    </>
  );
}

export default AddPatientPage;























// import styles from './add-patient-page.module.scss';
// import Snackbar from '@mui/material/Snackbar';
// import MuiAlert from '@mui/material/Alert';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Icon,
//   Typography,
//   FormHelperText,
//   InputAdornment,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';

// import { environment } from '../../../../environments/environment';
// import Breadcrumbs from '../../../Components/bread-crumbs/bread-crumbs';

// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { CountriesStates } from '../../../core/consts/countries-states';

// import { useContext, useState } from 'react';
// import { Controller, useForm } from 'react-hook-form';
// import { enqueueSnackbar } from 'notistack';

// import { Gender } from '@prisma/client';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import PhoneInput from 'react-phone-input-2'
// import 'react-phone-input-2/lib/style.css'
// import HospitalContext from '../../../contexts/hospital-context';
// import DoctorContext from '../../../contexts/doctor-context';

// export interface AddPatient {
//   firstName: string;
//   lastName: string;
//   email?: string;
//   phoneNumber?: string;
//   gender: Gender;
//   bloodGroup: string;
//   dob: Date;
//   digitalHealthCode: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   stateCode?: string;
//   countryCode: string;
//   postalCode: string;
//   isActive: boolean;
//   age:number;
// }

// interface Form {
//   firstName: string;
//   lastName: string;
//   email?: string;
//   phoneNumber?: string;
//   gender: Gender;
//   bloodGroup: string;
//   dob: Date;
//   digitalHealthCode: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   stateCode?: string;
//   countryCode: string;
//   postalCode: string;
//   isActive: boolean;
//   age:number;
// }


// /* eslint-disable-next-line */
// export interface AddPatientPageProps {
//   // open: boolean;
//   // onClose: () => void;
//   // onSubmit: (data: Form) => void;
//  }

// export function AddPatientPage(props: AddPatientPageProps) {
//   const [country, setCountry] = useState<string>('');

//   const apiUrl = environment.apiUrl;
//   const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);
//   const navigate = useNavigate();
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isSuccessSnackbarOpen, setIsSuccessSnackbarOpen] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const validationSchema = yup.object().shape({
//     firstName: yup.string().required('First Name is required'),
//     lastName: yup.string().required('Last Name is required'),
//     email: yup.string().email('Invalid email').required('Email is required'),
//     phoneNumber: yup.string().matches(/[6789][0-9]{9}/, 'Invalid phone number').required('Phone number is required'),
//     gender: yup.string().required('Please Select One'),
//     isActive: yup.boolean().required('Please Select One'),
//     bloodGroup: yup.string().required('Blood Group is required'),
//     dob: yup.date().required('Date Of Birth is required'),
//     digitalHealthCode: yup.string().required('Digital Health Code is required'),
//     addressLine1: yup.string().required('addressLine1 is required'),
//     addressLine2: yup.string().notRequired(),
//     city: yup.string().required('City is required'),
//     stateCode: yup.string().required('State Code is required'),
//     countryCode: yup.string().required('Country Code is required'),
//     postalCode: yup.string().required('Postal Code is required'),
//     age:yup.number().required('Age is required')
//   });
//   const {
//     handleSubmit,
//     control,
//     reset,
//     watch,
//     formState: { errors },
//   } = useForm<AddPatient>({
//     resolver: yupResolver(validationSchema),
//     defaultValues: {
//       stateCode: '',
//       isActive: true,
//     },
//   });

//   const countryValue = watch('countryCode');

//   const hospitalContext=useContext(HospitalContext)
//   console.log("hospitalcontext : ", hospitalContext);

//   const doctorcontext=useContext(DoctorContext);

//   // Add Patient
//   const handleAddPatient = async (formData: AddPatient) => {

//     try {
//       const { data: responseData } = await axios.post(`${apiUrl}/hospitals/${hospitalContext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patient`,
//         { firstName: formData.firstName, lastName: formData.lastName, gender: formData.gender, email: formData.email, phoneNumber: formData.phoneNumber,
//           bloodGroup: formData.bloodGroup, dob: formData.dob, digitalHealthCode: formData.digitalHealthCode, addressLine1: formData.addressLine1, addressLine2: formData.addressLine2, 
//           city: formData.city, stateCode: formData.stateCode, countryCode: formData.countryCode, postalCode: formData.postalCode, isActive: formData.isActive,
//           age:formData.age
//          },
//         {
//           withCredentials: true,

//         },)
//       if (responseData) {
//         reset();
//         enqueueSnackbar("Patient added successfully!", { variant: 'success' });
//         navigate(`/dashboard/${hospitalContext?.hospital?.id}`);
//         // setIsAddModalOpen(false);
//         // getPatients();

//       } else {
//         console.log("Something went wrong")
//       }

//     } catch (error) {
//       console.log(error);
//       console.log("Something went wrong in input form")
//       enqueueSnackbar('Something went wrong', { variant: 'error' });
//     }
//   }

//   const stateOptions =
//     CountriesStates.find((c) => c.code === countryValue)?.states || [];
//   const breadcrumbs = [
//     {
//       to: `/hospitals/${hospitalContext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/dashboard`,
//       label: 'Dashboard',
//     },
//     { to: `/hospitals/${hospitalContext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patients`, label: 'Patients' },
//     {
//       label: 'Add',
//     },
//   ];

//   return (
//     <>
//       <Breadcrumbs paths={breadcrumbs} />
//       <div className={styles['container']}>
//         <Typography variant="h1" sx={{ my: '20px' }}>
//           <Icon component={AddIcon} /> Add Patient
//         </Typography>
//         <form onSubmit={handleSubmit(handleAddPatient)}>
//           <div className={styles['form-row']}>
//             <div className={styles['form-item']}>
//               <Controller
//                 name="digitalHealthCode"
//                 control={control}
//                 defaultValue=""
//                 rules={{ required: 'Digital Health Code is required' }}
//                 render={({ field }) => (
//                   <TextField
//                     label="Digital Health Code*"
//                     variant="outlined"
//                     {...field}
//                     fullWidth
//                     error={!!errors.digitalHealthCode}
//                     helperText={errors.digitalHealthCode?.message}
//                   />
//                 )}
//               />
//             </div>
//             <div className={styles['form-item']}>
//               <Controller
//                 name="firstName"
//                 control={control}
//                 defaultValue=""
//                 rules={{ required: 'First Name is required' }}
//                 render={({ field }) => (
//                   <TextField
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter First Name"
//                     {...field}
//                     label="First Name*"
//                     error={!!errors.firstName}
//                     helperText={errors.firstName?.message}
//                     sx={{ width: '100%' }}
//                   />

//                 )}
//               />
//             </div>

//           </div>
//           <div className={styles['form-row']}>
//             <div className={styles['form-item']}>
//               <Controller
//                 name="lastName"
//                 control={control}
//                 defaultValue=""
//                 rules={{ required: 'Last Name is required' }}
//                 render={({ field }) => (
//                   <TextField
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter Last Name"
//                     {...field}
//                     label="Last Name*"
//                     error={!!errors.lastName}
//                     helperText={errors.lastName?.message}
//                     sx={{ width: '100%' }}
//                   />

//                 )}
//               />
//             </div>
//             <div className={styles['form-item']}>
//               <Controller
//                 name="email"
//                 control={control}
//                 defaultValue=""
//                 rules={{ required: 'Email is required' }}
//                 render={({ field }) => (
//                   <TextField
//                     type="email"
//                     className="form-control"
//                     placeholder="Enter Email"
//                     {...field}
//                     label="Email*"
//                     error={!!errors.email}
//                     helperText={errors.email?.message}
//                     sx={{ width: '100%' }}
//                   />
//                 )}
//               />
//             </div>
//           </div>
//           <div className={styles['form-row']}>
//             <div className={styles['form-item']}>
//               <Controller
//                 name="phoneNumber"
//                 control={control}
//                 defaultValue=""
//                 rules={{
//                   required: 'Phone Number is required',
//                 }}
//                 render={({ field }) => (
//                   <PhoneInput
//                     {...field}
//                     inputStyle={{
//                       borderColor: (errors.phoneNumber) && "#de0835",
//                       boxSizing: 'inherit',
//                       height: '55px',
//                       width: '100%',
//                       maxWidth: "524px"
//                     }}
//                     country={'in'}
//                     value={field.value}
//                     onChange={(phone: any) => field.onChange(phone)}
//                   // error={!!errors.phoneNumber}
//                   // helperText={errors.phoneNumber?.message}
//                   />
//                 )}
//               />
//               {!!errors.phoneNumber && <Typography sx={{ color: '#de0835', fontSize: [13, "!important"], marginLeft: '13px' }} >{errors.phoneNumber.message}</Typography>}
//             </div>
//             <div className={styles['form-item']}>
//               <FormControl sx={{ width: '100%' }} error={!!errors.gender}>
//                 <InputLabel htmlFor="type"  >Gender*</InputLabel>
//                 <Controller
//                   name="gender"
//                   control={control}
//                   // defaultValue=""
//                   rules={{ required: 'Gender is required' }}
//                   render={({ field }) => (
//                     <Select
//                       label="Gender*"
//                       variant="outlined"
//                       {...field}
//                       error={!!errors.gender}
//                       MenuProps={{
//                         PaperProps: {
//                           style: {
//                             maxHeight: 97
//                           },
//                         },
//                       }}
//                     >
//                       <MenuItem sx={{ justifyContent: "start" }} value="MALE">Male</MenuItem>
//                       <MenuItem sx={{ justifyContent: "start" }} value="FEMALE">Female</MenuItem>
//                       <MenuItem sx={{ justifyContent: "start" }} value="OTHERS">Others</MenuItem>
//                     </Select>

//                   )}
//                 />
//                 {/* <FormHelperText>{errors.gender?.message}</FormHelperText> */}
//               </FormControl>
//             </div>

//           </div>
//           <div className={styles['form-row']}>
//             <div className={styles['form-item']}>
//               <Controller
//                 name="bloodGroup"
//                 control={control}
//                 defaultValue=""
//                 rules={{ required: 'Blood Group is required' }}
//                 render={({ field }) => (
//                   <TextField
//                     label="Blood Group*"
//                     variant="outlined"
//                     {...field}
//                     fullWidth
//                     error={!!errors.bloodGroup}
//                     helperText={errors.bloodGroup?.message}
//                   />
//                 )}
//               />
//             </div>
//             <div className={styles['form-item']}>
//               <Controller
//                 name="dob"
//                 control={control}
//                 render={({ field, fieldState: { error } }) => (
//                   <LocalizationProvider dateAdapter={AdapterDayjs}>
//                     <DatePicker
//                       {...field}
//                       label="DOB"
//                       slotProps={{
//                         textField: {
//                           error: !!error,
//                           helperText: error?.message,
//                           fullWidth: true,
//                         },
//                       }}
//                     />
//                   </LocalizationProvider>
//                 )}
//               />
//             </div>

//           </div>
//           <div className={styles['form-row']}>
//             <div className={styles['form-item']}>
//               <Controller
//                 name="addressLine1"
//                 control={control}
//                 defaultValue=""
//                 rules={{ required: 'Address_line1 is required' }}
//                 render={({ field }) => (
//                   <TextField
//                     label="Address 1*"
//                     variant="outlined"
//                     {...field}
//                     fullWidth
//                     error={!!errors.addressLine1}
//                     helperText={errors.addressLine1?.message}
//                   />
//                 )}
//               />
//             </div>
//             <div className={styles['form-item']}>
//               <Controller
//                 name="addressLine2"
//                 control={control}
//                 defaultValue=""
//                 rules={{ required: 'address_line2 is required' }}
//                 render={({ field }) => (
//                   <TextField
//                     label="Address 2"
//                     variant="outlined"
//                     {...field}
//                     fullWidth
//                     error={!!errors.addressLine2}
//                     helperText={errors.addressLine2?.message}
//                   />
//                 )}
//               />
//             </div>

//           </div>

//           <div className={styles['form-row']}>
//             <div className={styles['form-item']}>
//               <Controller
//                 name="city"
//                 control={control}
//                 defaultValue=""
//                 rules={{ required: 'City is required' }}
//                 render={({ field }) => (
//                   <TextField
//                     label="City*"
//                     variant="outlined"
//                     {...field}
//                     fullWidth
//                     error={!!errors.city}
//                     helperText={errors.city?.message}
//                   />
//                 )}
//               />
//             </div>
//             <div className={styles['form-item']}>
//               <Controller
//                 name="countryCode"
//                 control={control}
//                 defaultValue={""}
//                 render={({ field }) => (
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel>Country*</InputLabel>
//                     <Select
//                       {...field}
//                       label="Country*"
//                       value={field.value || ""}
//                       error={!!errors.countryCode}

//                     >
//                       {CountriesStates.map((countryData, index) => (
//                         <MenuItem key={index} value={countryData.code} >
//                           {countryData.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 )}
//               />
//               <FormHelperText sx={{ ml: "12px", color: "#d32f2f" }}>{errors.countryCode?.message}</FormHelperText>
//             </div>

//           </div>
//           <div className={styles['form-row']}>
//             <div className={styles['form-item']}>
//               <Controller
//                 name="stateCode"
//                 control={control}
//                 defaultValue=""
//                 render={({ field }) => (
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel>State</InputLabel>
//                     <Select {...field} label="State*">
//                       {stateOptions.map((stateData, index) => (
//                         <MenuItem key={index} value={stateData.code}>
//                           {stateData.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 )}
//               />
//             </div>
//             <div className={styles['form-item']}>
//               <Controller
//                 name="postalCode"
//                 control={control}
//                 defaultValue=""
//                 rules={{ required: 'postalcode is required' }}
//                 render={({ field }) => (
//                   <TextField
//                     label="Postal Code*"
//                     variant="outlined"
//                     {...field}
//                     fullWidth
//                     error={!!errors.postalCode}
//                     helperText={errors.postalCode?.message}
//                   />
//                 )}
//               />
//             </div>
//             <div className={styles['form-item']}>
//               <Controller
//                 name="age"
//                 control={control}
//                 // defaultValue={0}
//                 rules={{ required: 'Age is required' }}
//                 render={({ field }) => (
//                   <TextField
//                     label="Age*"
//                     variant="outlined"
//                     {...field}
//                     fullWidth
//                     error={!!errors.age}
//                     helperText={errors.age?.message}
//                   />
//                 )}
//               />
//             </div>

//           </div>
//           <div className={styles['form-row']}>
//             <div className={styles['form-item']}>
//               <Button variant="contained" color="primary" type="submit">
//                 Save
//               </Button>
//             </div>
//           </div>
//         </form>

//       </div>
//     </>
//   );
// }

// export default AddPatientPage;
