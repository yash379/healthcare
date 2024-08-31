import styles from './edit-hospital.module.scss';
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
import {
  Dialog,
  Divider,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { CountriesStates } from '../../../core/consts/countries-states';
import CancelIcon from '@mui/icons-material/Cancel';

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

export interface EditHospitalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: AddHospital) => void;
  initialData: AddHospital | null;
}

const EditHospitalComponent: React.FC<EditHospitalProps> = ({
  open,
  onClose,
  onUpdate,
  initialData,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [stateOptions, setStateOptions] = useState<
    { name: string; code: string }[]
  >([]);

  const [country, setCountry] = useState();
  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup
      .string()
      .matches(/[6789][0-9]{9}/, 'Invalid phone number')
      .min(10)
      .required('Phone Number is required'),
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
    resetField,
    trigger,
    formState: { errors, isSubmitted },
    watch,
    setValue,
  } = useForm<ViewHospital>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('code', initialData.code);
      setValue('email', initialData.email);
      setValue('phoneNumber', initialData.phoneNumber);
      setValue('addressLine1', initialData.addressLine1);
      setValue('addressLine2', initialData.addressLine2);
      setValue('city', initialData.city);
      setValue('countryCode', initialData.countryCode);
      setStateOptions(
        CountriesStates.find((c) => c.code === initialData.countryCode)?.states ||
          [],
      );
      setValue('stateCode', initialData.stateCode);
      setValue('postalCode', initialData.postalCode);
    }
  }, [initialData, setValue]);

  const handleUpdate = (data: AddHospital) => {
    // data.flatId = parseInt(data.flatId);
    onUpdate(data);
    reset();
  };

  const countryValue = watch('countryCode');
  useEffect(() => {
    if (countryValue) stateOptions.length <= 0 && setValue('stateCode', 'None');
  }, [countryValue, setValue, stateOptions]);


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <div style={{ padding: '24px 24px 24px 24px' }}>
        <div>
          <Typography
            variant="h2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            Edit Hospital
            <IconButton onClick={onClose} aria-label="Close">
              <CancelIcon />
            </IconButton>
          </Typography>
          <form onSubmit={handleSubmit(handleUpdate)}>
            <Box>
              <Typography
                color="#727070"
                sx={{ my: '10px', fontWeight: 500, fontSize: '16px' }}
              >
                {' '}
                Profile Details
              </Typography>
              <div className={styles['form-row']}>
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
                        sx={{ width: '100%' }}
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        inputProps={{ maxLength: 254 }}
                      />
                    )}
                  />
                </div>
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
                        sx={{ width: '100%' }}
                        fullWidth
                        error={!!errors.code}
                        
                        helperText={errors.code?.message}
                        inputProps={{ readOnly: true, maxLength: 254 }}
                      />
                    )}
                  />
                </div>
              </div>
              <Divider sx={{ mt: '20px', color: '#000000' }} />
              <Typography
                color="#727070"
                sx={{ my: '10px', fontWeight: 500, fontSize: '16px' }}
              >
                {' '}
                Contact Details
              </Typography>
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
                        sx={{ width: '100%' }}
                        fullWidth
                        inputProps={{ maxLength: 254 }}
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
                        sx={{ width: '100%' }}
                        fullWidth
                        inputProps={{ maxLength: 50 }}
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
                        sx={{ width: '100%' }}
                        inputProps={{ maxLength: 254 }}
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
                        sx={{ width: '100%' }}
                        inputProps={{ maxLength: 254 }}
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
                        sx={{ width: '100%' }}
                        inputProps={{ maxLength: 254 }}
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
                      //     <FormControl fullWidth variant="outlined" >
                      //       <InputLabel>Country*</InputLabel>
                      //       <Select
                      //         {...field}
                      //         label="Country*"
                      //         sx={{width: '100%'}}
                      //         fullWidth
                      //         error={!!errors.countryCode}
                      //         disabled
                      //       >
                      //         {CountriesStates.map((countryData, index) => (
                      //           <MenuItem key={index} value={countryData.code}>
                      //             {countryData.name}
                      //           </MenuItem>
                      //         ))}
                      //       </Select>
                      //     </FormControl>
                      //   )}
                      // />
                      // <FormHelperText sx={{ ml: "12px", color: "#d32f2f" }}>{errors.countryCode?.message}</FormHelperText>
                      <FormControl
                        error={!!errors.countryCode}
                        variant="outlined"
                        fullWidth
                        disabled={isUploading}
                        size="small"
                        
                        sx={{
                          width: '100%',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          },
                        }}
                      >
                        <InputLabel>
                          {' '}
                          {
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              Country
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
                        <Select
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setStateOptions(
                              CountriesStates.find(
                                (c) => c.code === e.target.value
                              )?.states || []
                            );
                            resetField('stateCode', { defaultValue: '' });
                            if (isSubmitted) {
                              trigger('stateCode').then();
                            }
                          }}
                          label="Country *"
                          error={!!errors.countryCode}
                          disabled={isUploading}
                          inputProps={{ maxLength: 2 }}
                        >
                          {CountriesStates.map((countryData, index) => (
                            <MenuItem key={index} value={countryData.code}>
                              {countryData.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText error={!!errors.countryCode}>
                          {errors.countryCode?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </div>
              </div>
              <div className={styles['form-row']}>
                <div className={styles['form-item']}>
                  <Controller
                    name="stateCode"
                    control={control}
                    defaultValue={initialData?.stateCode ?? ''}
                    render={({ field }) => (
                      //     <FormControl fullWidth variant="outlined" >
                      //       <InputLabel>State</InputLabel>
                      //       <Select {...field} label="State*"  sx={{width: '100%'}}>
                      //         {stateOptions.map((stateData, index) => (
                      //           <MenuItem key={index} value={stateData.code}>
                      //             {stateData.name}
                      //           </MenuItem>
                      //         ))}
                      //       </Select>
                      //     </FormControl>
                      //   )}
                      // />
                      <FormControl
                        error={!!errors.stateCode}
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{
                          width: '100%',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          },
                        }}
                        disabled={isUploading}
                      >
                        <InputLabel>
                          {stateOptions.length > 0 ? (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              State
                              <Typography
                                fontSize="medium"
                                sx={{ ml: '3px', color: '#B12A28' }}
                              >
                                *
                              </Typography>
                            </Box>
                          ) : (
                            'State'
                          )}
                        </InputLabel>
                        <Select
                          {...field}
                          label={
                            stateOptions.length > 0 ? (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                State
                                <Typography
                                  fontSize="medium"
                                  sx={{ ml: '3px', color: '#B12A28' }}
                                >
                                  *
                                </Typography>
                              </Box>
                            ) : (
                              'State'
                            )
                          }
                          error={!!errors.stateCode}
                          disabled={isUploading}
                          inputProps={{ maxLength: 3 }}
                        >
                          {stateOptions.map((stateData, index) => (
                            <MenuItem key={index} value={stateData.code}>
                              {stateData.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText error={!!errors.stateCode}>
                          {errors.stateCode?.message}
                        </FormHelperText>
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
                        sx={{ width: '100%' }}
                        fullWidth
                        inputProps={{ maxLength: 50 }}
                        error={!!errors.postalCode}
                        helperText={errors.postalCode?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </Box>
            <div style={{ textAlign: 'end' }}>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mr: '8px', borderRadius: '12px' }}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ borderRadius: '12px' }}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default EditHospitalComponent;
