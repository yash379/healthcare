import styles from './add-hospital.module.scss';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { environment } from '../../../../environments/environment';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { CountriesStates } from '../../../core/consts/countries-states';
import CancelIcon from '@mui/icons-material/Cancel';

export interface AddHospital {
  code: string;
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
}

export interface AddHospitalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddHospital) => void;
}

const AddHospitalComponent: React.FC<AddHospitalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [country, setCountry] = useState<string>('');
  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    addressLine1: yup.string().required(),
    addressLine2: yup.string().notRequired(),
    city: yup.string().required(),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup
      .string()
      .matches(/[6789][0-9]{9}/, 'Invalid phone number')
      .min(10)
      .max(10)
      .required('Phone Number is required'),
    stateCode: yup.string().notRequired(),
    countryCode: yup.string().required('CountryCode is required'),
    postalCode: yup.string().required('PostalCode is required'),
    code: yup.string().required('code is required'),
  });
  const {
    handleSubmit,
    control,
    reset,
    watch,
    trigger,
    resetField,
    formState: { errors, isSubmitted },
  } = useForm<AddHospital>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      stateCode: '',
      isActive: true,
    },
  });
  const [isUploading, setIsUploading] = useState(false);
  const [stateOptions, setStateOptions] = useState<
    { name: string; code: string }[]
  >([]);
  const handleFormSubmit = (data: AddHospital) => {
    onSubmit(data);
    reset();
  };

  // const countryValue = watch('countryCode');
  // setCountry(countryValue)
  // const stateOptions =
  //   CountriesStates.find((c) => c.code === countryValue)?.states || [];

  useEffect(() => {
    const countryValue = watch('countryCode');
    setCountry(countryValue);
  }, [watch('countryCode')]);

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
            {' '}
            Add Hospital
            <IconButton onClick={onClose} aria-label="Close">
              <CancelIcon />
            </IconButton>
          </Typography>

          <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                        type="text"
                        className="form-control"
                        placeholder="Enter Hospital Name"
                        {...field}
                        label="Name"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        sx={{ width: '100%' }}
                        fullWidth
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
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            Hospital Code
                            <Typography
                              fontSize="medium"
                              color="error"
                              sx={{ ml: '3px' }}
                            >
                              *
                            </Typography>
                          </Box>
                        }
                        variant="outlined"
                        inputProps={{ maxLength: 254 }}
                        {...field}
                        fullWidth
                        error={!!errors.code}
                        helperText={errors.code?.message}
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
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            Email
                            <Typography
                              fontSize="medium"
                              color="error"
                              sx={{ ml: '3px' }}
                            >
                              *
                            </Typography>
                          </Box>
                        }
                        variant="outlined"
                        inputProps={{ maxLength: 254 }}
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
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            Phone Number
                            <Typography
                              fontSize="medium"
                              color="error"
                              sx={{ ml: '3px' }}
                            >
                              *
                            </Typography>
                          </Box>
                        }
                        variant="outlined"
                        inputProps={{ maxLength: 50 }}
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
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            Address 1
                            <Typography
                              fontSize="medium"
                              color="error"
                              sx={{ ml: '3px' }}
                            >
                              *
                            </Typography>
                          </Box>
                        }
                        variant="outlined"
                        inputProps={{ maxLength: 254 }}
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
                      inputProps={{ maxLength: 254 }}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            Address 2
                            <Typography
                              fontSize="medium"
                              color="error"
                              sx={{ ml: '3px' }}
                            >
                              *
                            </Typography>
                          </Box>
                        }
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
                      inputProps={{ maxLength: 254 }}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            City
                            <Typography
                              fontSize="medium"
                              color="error"
                              sx={{ ml: '3px' }}
                            >
                              *
                            </Typography>
                          </Box>
                        }
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
                      <FormControl
                        error={!!errors.countryCode}
                        variant="outlined"
                        fullWidth
                        disabled={isUploading}
                        sx={{
                          width: '100%',
                        }}
                      >
                        <InputLabel>
                          {
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                    defaultValue=""
                    render={({ field }) => (
                      <FormControl
                        error={!!errors.stateCode}
                        variant="outlined"
                        fullWidth
                        sx={{
                          width: '100%',
                        }}
                        disabled={isUploading}
                      >
                        <InputLabel>
                          {stateOptions.length > 0 ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                                sx={{ display: 'flex', alignItems: 'center' }}
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
                          disabled={isUploading || stateOptions.length === 0}
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
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            Postal Code
                            <Typography
                              fontSize="medium"
                              color="error"
                              sx={{ ml: '3px' }}
                            >
                              *
                            </Typography>
                          </Box>
                        }
                        variant="outlined"
                        {...field}
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

export default AddHospitalComponent;
