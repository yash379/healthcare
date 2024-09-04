import styles from './edit-patient-page.module.scss';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
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
  Chip,
} from '@mui/material';
import { environment } from '../../../../environments/environment';
import Breadcrumbs from '../../../Components/bread-crumbs/bread-crumbs';
import EditIcon from '@mui/icons-material/Edit';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CountriesStates } from '../../../core/consts/countries-states';

import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AcuteDisease, ChronicDisease, Gender, Patient } from '@prisma/client';
import { enqueueSnackbar } from 'notistack';
import { HospitalContext } from '../../../contexts/user-contexts';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AddPatient, ViewPatient } from '@healthcare/data-transfer-types';

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

export interface EditPatient {
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
  chronicDiseases?: ChronicDisease[]; // Array of ChronicDisease enums
  acuteDiseases?: AcuteDisease[]; // Array of AcuteDisease enums
  // isActive: boolean;
}

// export interface ViewPatient {
//   firstName: string;
//   lastName: string;
//   email?: string;
//   phoneNumber?: string;
//   gender: Gender;
//   bloodgroup: string;
//   dob: Date;
//   digitalHealthCode: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   stateCode?: string;
//   countryCode: string;
//   postalCode: string;
//   isActive: boolean;
// }

/* eslint-disable-next-line */
export interface EditPatientPageProps {}

export function EditPatientPage(props: EditPatientPageProps) {
  const apiUrl = environment.apiUrl;
  const [patient, setPatient] = useState<ViewPatient | null>(null);
  const { hospitalId, patientId } = useParams<{
    hospitalId: string;
    patientId: string;
  }>();
  console.log('Hospital ID:', hospitalId);
  console.log('Patient ID:', patientId);
  // const patientContext = useContext(PatientContext);
  //get patientid as id from patientContext
  // const { patient: id } = patientContext;
  // console.log(patientContext,"patientcontext");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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
    chronicDiseases: yup
      .array()
      .of(yup.string().required('Each chronic disease must be a valid string'))
      .min(1, 'At least one chronic disease is required')
      .required('chronicDiseases is required'),

    acuteDiseases: yup
      .array()
      .of(yup.string().required('Each acute disease must be a valid string'))
      .min(1, 'At least one acute disease is required')
      .required('acuteDiseases is required'),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EditPatient>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const countryValue = watch('countryCode');
  const stateOptions =
    CountriesStates.find((c) => c.code === countryValue)?.states || [];

  const params = useParams();
  console.log('params', params);
  const hospitalContext = useContext(HospitalContext);
  console.log(hospitalContext, params);

  const chronicDiseaseOptions = Object.values(ChronicDisease);
  const acuteDiseaseOptions = Object.values(AcuteDisease);

  useEffect(() => {
    async function fetchPatientData() {
      try {
        const response = await axios.get(
          `${apiUrl}/hospitals/${hospitalContext?.id}/doctors/${params.doctorId}/patient/${params.patientId}`,
          {
            withCredentials: true,
          }
        );
        const patientData = response.data;
        console.log('patientData reponse latest', response);
        setPatient(patientData);

        // Set the form data using setValue
        setValue('digitalHealthCode', patientData.digitalHealthCode);
        setValue('email', patientData.email);
        setValue('firstName', patientData.firstName);
        setValue('lastName', patientData.lastName);
        setValue('phoneNumber', patientData.phoneNumber);
        setValue('gender', patientData.gender);
        setValue('dob', patientData.dob);
        setValue('bloodGroup', patientData.bloodGroup);
        setValue('age', patientData.age);
        setValue('addressLine1', patientData.addressLine1);
        setValue('addressLine2', patientData.addressLine2);
        setValue('city', patientData.city);
        setValue('countryCode', patientData.countryCode);
        setValue('stateCode', patientData.stateCode);
        setValue('postalCode', patientData.postalCode);
        setValue('chronicDiseases', patientData.chronicDisease);
        setValue('acuteDiseases', patientData.acuteDisease);
      } catch (error) {
        console.error('Error fetching Patient data:', error);
      }
    }

    fetchPatientData();
  }, [apiUrl, id, setValue, hospitalContext?.id, params.patientId]);

  const onSubmit = async (data: EditPatient) => {
    try {
      const response = await axios.put(
        `${apiUrl}/hospitals/${hospitalContext?.id}/doctors/${params.doctorId}/patient/${params.patientId}`,
        {...data, dob: data.dob ? data.dob.toISOString() : undefined},
        {
          withCredentials: true,
        }
      );
      console.log('Patient updated:', response.data);

      enqueueSnackbar('Patient updated successfully!', { variant: 'success' });
      navigate(
        `/hospitals/${hospitalContext?.id}/doctors/${params.doctorId}/patients`
      );
    } catch (error) {
      console.error('Error updating Patient:', error);
      enqueueSnackbar(
        'Something went wrongAn error occurred while updating the patient.',
        { variant: 'error' }
      );
    }
  };

  // const parseDate = (date?: any) => {
  //   if (date) {
  //     const parse = Date.parse(date);
  //     if (!isNaN(parse)) {
  //       return new Date(parse);
  //     }
  //   }
  //   return undefined;
  // };

  const breadcrumbs = [
    {
      to: `/dashboard/${hospitalContext?.id}`,
      label: 'Dashboard',
    },
    { to: `/hospitals/${hospitalContext?.id}/patients`, label: 'Patients' },
    {
      label: 'Edit',
    },
  ];
  return (
    <>
      <Breadcrumbs paths={breadcrumbs} />
      <div className={styles['container']}>
        <Typography variant="h1" sx={{ my: '20px' }}>
          <Icon component={EditIcon} /> Edit Patient
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    variant="outlined"
                    {...field}
                    fullWidth
                    // disabled
                    inputProps={{ readOnly: true }}
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
                    sx={{ width: '100%' }}
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
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    sx={{ width: '100%' }}
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
                    sx={{ width: '100%' }}
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
                        <InputAdornment sx={{ mt: '1px' }} position="start">
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
              </Grid>
              <Grid item xs={12} sm={6}>
              <FormControl sx={{ width: '100%' }} error={!!errors.gender}>
                <InputLabel htmlFor="type">Gender*</InputLabel>
                <Controller
                  name="gender"
                  control={control}
                  defaultValue={patient?.gender}
                  rules={{ required: 'Gender is required' }}
                  render={({ field }) => (
                    <Select
                      label="Gender*"
                      variant="outlined"
                      {...field}
                      error={!!errors.gender}
                      value={field.value || ''}
                      // MenuProps={{
                      //   PaperProps: {
                      //     style: {
                      //       maxHeight: 97,
                      //     },
                      //   },
                      // }}
                    >
                      <MenuItem sx={{ justifyContent: 'start' }} value="MALE">
                        Male
                      </MenuItem>
                      <MenuItem sx={{ justifyContent: 'start' }} value="FEMALE">
                        Female
                      </MenuItem>
                      <MenuItem sx={{ justifyContent: 'start' }} value="OTHERS">
                        Others
                      </MenuItem>
                    </Select>
                  )}
                />
                <FormHelperText>{errors.gender?.message}</FormHelperText>
              </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
              <Controller
                name="dob"
                control={control}
                // defaultValue={parseDate(patient?.dob)}
                render={({ field, fieldState: { error } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      value={field.value ? dayjs(field.value) : undefined}
                      label="DateOf Birth"
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
               <Grid item xs={12} sm={6}>
              <Controller
                name="bloodGroup"
                control={control}
                defaultValue=""
                rules={{ required: 'Blood Group is required' }}
                render={({ field }) => (
                  <TextField
                    label="Blood Group*"
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.bloodGroup}
                    helperText={errors.bloodGroup?.message}
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
               </Grid>
               <Grid item xs={12} sm={6}>
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
          </Grid>
          <Grid item xs={12} sm={6}>
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
          </Grid>
          <Grid item xs={12} sm={6}>
              <Controller
                name="countryCode"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Country*</InputLabel>
                    <Select
                      {...field}
                      label="Country*"
                      error={!!errors.countryCode}
                      // disabled
                    >
                      {CountriesStates.map((countryData, index) => (
                        <MenuItem key={index} value={countryData.code}>
                          {countryData.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <FormHelperText sx={{ ml: '12px', color: '#d32f2f' }}>
                {errors.countryCode?.message}
              </FormHelperText>
              </Grid>
            <Grid item xs={12} sm={6}>
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
            </Grid>

<Grid item xs={12} sm={6}>
              <Controller
                name="postalCode"
                control={control}
                defaultValue=""
                rules={{ required: 'postal code is required' }}
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
            </Grid>
            <Grid item xs={12} sm={6}>
            <FormControl
                sx={{ width: '100%', marginBottom: 2 }}
                error={!!errors.chronicDiseases}
              >
           <Controller
            name="chronicDiseases"
            control={control}
            rules={{ required: 'Chronic Diseases are required' }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                options={chronicDiseaseOptions}
                getOptionLabel={(option) => option}
                renderTags={(value: string[], getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })} // getTagProps already includes 'key'
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Select Chronic Diseases"
                    placeholder="Chronic Diseases"
                    error={!!errors.chronicDiseases}
                  />
                )}
                onChange={(_, value) =>
                  field.onChange(value.map((v) => v.toUpperCase()))
                }
                value={field.value || []} // Ensure controlled value
              />
            )}
          />
                <FormHelperText>
                  {errors.chronicDiseases?.message}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                sx={{ width: '100%', marginBottom: 2 }}
                error={!!errors.acuteDiseases}
              >
            <Controller
            name="acuteDiseases"
            control={control}
            rules={{ required: 'Acute Disease is required' }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                options={acuteDiseaseOptions}
                getOptionLabel={(option) => option}
                renderTags={(value: string[], getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })} // getTagProps already includes 'key'
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Select Acute Diseases"
                    placeholder="Acute Diseases"
                    error={!!errors.acuteDiseases}
                  />
                )}
                onChange={(_, value) =>
                  field.onChange(value.map((v) => v.toUpperCase()))
                }
                value={field.value || []} // Ensure controlled value
              />
            )}
          />
                <FormHelperText>{errors.acuteDiseases?.message}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
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

export default EditPatientPage;
