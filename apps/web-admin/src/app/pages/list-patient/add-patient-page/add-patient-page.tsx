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
  Grid, // Import Grid component
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
import { HospitalContext } from '../../../contexts/user-contexts';
import { AcuteDisease, ChronicDisease, Gender } from '@prisma/client';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

export interface AddPatient {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  gender: Gender;
  chronicDisease?: ChronicDisease;
  acuteDisease?: AcuteDisease;
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
  age: number;
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
    bloodgroup: yup.string().required('Blood Group is required'),
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
    chronicDisease: yup.string().required('chronicDisease is required'),
    acuteDisease: yup.string().required('acuteDisease is required'),
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

  console.log('hospitalcontext : ', hospitalContext);

  // Add Patient
  const handleAddPatient = async (formData: any) => {
    try {
      const { data: responseData } = await axios.post(
        `${apiUrl}/hospitals/${hospitalContext?.id}/doctors/${params.doctorId}/patient`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          bloodGroup: formData.bloodgroup,
          // dob: formData.dob,
          dob: '2024-09-03T17:54:34.885Z',
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
        navigate(`/hospitals/${hospitalContext?.id}`);
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
      to: '/',
      label: 'Home',
    },
    { to: `/hospitals/${hospitalContext?.id}`, label: 'Hospital' },
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <Controller
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="bloodgroup"
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
                    error={!!errors.bloodgroup}
                    helperText={errors.bloodgroup?.message}
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <Controller
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="acuteDisease"
                control={control}
                rules={{ required: 'acuteDisease is required' }}
                render={({ field }) => (
                  <FormControl
                    sx={{
                      width: '100%',
                      marginBottom: 1,
                    }}
                    error={!!errors.acuteDisease}
                  >
                    <InputLabel>AcuteDisease</InputLabel>
                    <Select {...field} label="acuteDisease*">
                      {Object.keys(AcuteDisease).map((acuteDisease, i) => (
                        <MenuItem key={i} value={acuteDisease}>
                          {acuteDisease}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.acuteDisease?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, width: '20%' }}
          >
            Submit
          </Button>
        </form>
      </div>
    </>
  );
}

export default AddPatientPage;
