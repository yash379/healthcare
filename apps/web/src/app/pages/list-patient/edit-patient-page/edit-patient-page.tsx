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
import { Gender, Patient } from '@prisma/client';
import { enqueueSnackbar } from 'notistack';
import { HospitalContext } from '../../../contexts/user-context';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { PatientContext } from '../../../contexts/patient-context';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export interface EditPatient {
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

export interface ViewPatient {
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
export interface EditPatientPageProps {}

export function EditPatientPage(props: EditPatientPageProps) {
  const apiUrl = environment.apiUrl;
  const [patient, setPatient] = useState<ViewPatient | null>(null);
  const { hospitalId, patientId } = useParams<{ hospitalId: string, patientId: string }>();
  console.log('Hospital ID:', hospitalId);
console.log('Patient ID:', patientId);
const patientContext = useContext(PatientContext);
//get patientid as id from patientContext
// const { patient: id } = patientContext;
console.log(patientContext,"patientcontext");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const validationSchema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup
      .string()
      .matches(/^(?:\+?91|0)?[6-9]\d{9}$/, 'Invalid phone number')
      .required('Phone number is required'),
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
    formState: { errors },
    watch,
    setValue,
  } = useForm<ViewPatient>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const PhoneNumber = watch('phoneNumber');

  console.log("phone Number", PhoneNumber)

  const countryValue = watch('countryCode');
  const stateOptions =
    CountriesStates.find((c) => c.code === countryValue)?.states || [];

  const params = useParams();
  console.log("params", params)
  const hospitalContext = useContext(HospitalContext);
  console.log(hospitalContext, params);

  useEffect(() => {
    async function fetchPatientData() {
      try {
        const response = await axios.get<ViewPatient>(
          `${apiUrl}/hospitals/${hospitalContext?.id}/patients/${params.patientId}`,
          {
            withCredentials: true,
          }
        );
        const patientData = response.data;
        console.log('patientData reponse latest', response);
        setPatient(patientData);

        // Set the form data using setValue
        setValue('firstName', patientData.firstName);
        setValue('lastName', patientData.lastName);
        setValue('email', patientData.email);
        setValue('phoneNumber', patientData.phoneNumber);
        setValue('gender', patientData.gender);
        setValue('bloodgroup', patientData.bloodgroup);
        setValue('dob', new Date(patientData.dob));
        setValue('digitalHealthCode', patientData.digitalHealthCode);
        setValue('addressLine1', patientData.addressLine1);
        setValue('addressLine2', patientData.addressLine2);
        setValue('city', patientData.city);
        setValue('countryCode', patientData.countryCode);
        setValue('stateCode', patientData.stateCode);
        setValue('postalCode', patientData.postalCode);
      } catch (error) {
        console.error('Error fetching Patient data:', error);
      }
    }

    fetchPatientData();
  }, [apiUrl, id, setValue, hospitalContext?.id, params.patientId]);

  const onSubmit = async (data: EditPatient) => {
    try {
      const response = await axios.put(
        `${apiUrl}/hospitals/${hospitalContext?.id}/patients/${params.patientId}`,
        data,
        {
          withCredentials: true,
        }
      );
      console.log('Patient updated:', response.data);

      enqueueSnackbar('Patient updated successfully!', { variant: 'success' });
      navigate(`/hospital/${hospitalContext?.id}/patients`);
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
    { to: `/hospital/${hospitalContext?.id}/patients`, label: 'Patients' },
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
                    disabled
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
                  //       <InputAdornment sx={{ mt: '1px' }} position="start">
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
                <InputLabel htmlFor="type">Gender*</InputLabel>
                <Controller
                  name="gender"
                  control={control}
                  defaultValue=""
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
                            maxHeight: 97,
                          },
                        },
                      }}
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
                // defaultValue={parseDate(patient?.dob)}
                render={({ field, fieldState: { error } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      value={field.value ? dayjs(field.value) : undefined}
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

export default EditPatientPage;
