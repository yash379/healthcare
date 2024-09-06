import styles from './edit-hospital-page.module.scss';
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
import { Hospital } from '@prisma/client';
import { enqueueSnackbar } from 'notistack';
import { HospitalContext } from '../../../contexts/hospital-context';


export interface AddHospital {
  name: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  isActive: boolean;
  code: string;
}

export interface ViewHospital {
  name: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  isActive: boolean;
  code: string;
}

/* eslint-disable-next-line */
export interface EditHospitalPageProps { }

export function EditHospitalPage(props: EditHospitalPageProps) {
  const apiUrl = environment.apiUrl;
  const [hospital, setHospital] = useState<ViewHospital | null>(null);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup.string().matches(/[6789][0-9]{9}/, 'Invalid phone number').min(10).required('Phone Number is required'),
    addressLine1: yup.string().required('Address line 1 is required'),
    addressLine2: yup.string().notRequired(),
    city: yup.string().required('City is required'),
    stateCode: yup.string().notRequired(),
    countryCode: yup.string().required('CountryCode is required'),
    postalCode: yup.string().required('PostalCode is required'),
    code: yup.string().required('code is required'),
  });
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ViewHospital>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const countryValue = watch('countryCode');
  const stateOptions =
    CountriesStates.find((c) => c.code === countryValue)?.states || [];

  const params = useParams();
  const hospitalContext = useContext(HospitalContext);
  console.log(hospitalContext, params);

  useEffect(() => {
    async function fetchHospitaltData() {
      try {
        const response = await axios.get<ViewHospital>(`${apiUrl}/hospitals/${params.hospitalId}`,
          {
            withCredentials: true,

          }
        );
        const hospitalData = response.data;
        console.log('hospitalData', response);
        setHospital(hospitalData);

        // Set the form data using setValue
        setValue('name', hospitalData.name);
        setValue('email', hospitalData.email);
        setValue('phoneNumber', hospitalData.phoneNumber);
        setValue('addressLine1', hospitalData.addressLine1);
        setValue('addressLine2', hospitalData.addressLine2);
        setValue('city', hospitalData.city);
        setValue('countryCode', hospitalData.countryCode);
        setValue('stateCode', hospitalData.stateCode);
        setValue('postalCode', hospitalData.postalCode);
        setValue('code', hospitalData.code);
      } catch (error) {
        console.error('Error fetching Hospital data:', error);
      }
    }

    fetchHospitaltData();
  }, [apiUrl, id, setValue]);

  const onSubmit = async (data: AddHospital) => {
    try {
      const response = await axios.put(`${apiUrl}/hospitals/${params.hospitalId}`, data,
        {
          withCredentials: true,

        });
      console.log('Hospital updated:', response.data);

      enqueueSnackbar("Hospital updated successfully!", { variant: 'success' });
      navigate(`/hospitals`);
    } catch (error) {
      console.error('Error updating Hospital:', error);
      enqueueSnackbar("Something went wrongAn error occurred while updating the hospitals.", { variant: 'error' });

    }
  };

  const breadcrumbs = [
    {
      to: '/',
      label: 'Home',
    },
    { to: '/hospitals', label: 'Hospitals' },

    {
      label: 'Edit',
    },
  ];
  return (
    <>
      <Breadcrumbs paths={breadcrumbs} />
      <div className={styles['container']}>
        <Typography variant="h1" sx={{ my: '20px' }}>
          <Icon component={EditIcon} /> Edit Hospital
        </Typography  >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles['form-row']}>
          <div className={styles['form-item']}>
              <Controller
                name="code"
                control={control}
                defaultValue=""
                rules={{ required: 'code is required' }}
                render={({ field }) => (
                  <TextField
                    label="Hospital Code*"
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.code}
                    helperText={errors.code?.message}
                    disabled
                  />
                )}
              />
            </div>
            <div className={styles['form-item']}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField

                    label="Name*"
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </div>
           
          </div>
          <div className={styles['form-row']}>
          <div className={styles['form-item']}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Email*"
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </div>
            <div className={styles['form-item']}>
              <Controller
                name="phoneNumber"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Phone Number*"
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          +91
                        </InputAdornment>
                      ),
                    }}
                  />
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
                  <FormControl fullWidth variant="outlined" >
                    <InputLabel>Country*</InputLabel>
                    <Select

                      {...field}
                      label="Country*"
                      error={!!errors.countryCode}
                      disabled
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
                  <FormControl fullWidth variant="outlined" >
                    <InputLabel>State</InputLabel>
                    <Select {...field} label="State*" >
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

export default EditHospitalPage;
