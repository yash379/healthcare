import styles from './add-hospital.module.scss';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { environment } from '../../../../environments/environment';
import axios from 'axios';
import {  AddHospital} from '@healthcare/data-transfer-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { CountriesStates } from '../../../core/consts/countries-states';




export interface AddHospitalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddHospital) => void;
}


const AddHospitalComponent: React.FC<AddHospitalProps> = ({ open, onClose, onSubmit }) => {
  const [country, setCountry] = useState<string>('');
  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    // email: yup.string().email('Invalid email').required('Email is required'),
    // phoneNumber: yup.string().min(10).required('Phone number is required'),
    addressLine1: yup.string().notRequired(),
    addressLine2: yup.string().notRequired(),
    city: yup.string().notRequired(),
    stateCode: yup.string().required('StateCode is required'),
    countryCode: yup.string().required('CountryCode is required'),
    postalCode: yup.string().required('PostalCode is required'),
    // isActive: yup.boolean().required('')
    // isActive:yup.boolean().required()
  });

  const { handleSubmit, control, reset, watch, formState: { errors } } = useForm<AddHospital>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      isActive: true
    }
  });

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
  
  const stateOptions =
    CountriesStates.find((c) => c.code === country)?.states || [];
  

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2>Add New Hospital</h2>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "row" }} className={styles['modal_form_containers']}>
            <Box className={styles['modal_first_container']}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    className="form-control"
                    placeholder="Enter new Hospital Name"
                    {...field}
                    label="Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ marginTop: "5px" }}
                  />
                )}
              />
              {/* <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{ required: 'Email is required' }}
                render={({ field }) => (
                  <TextField
                    type="email"
                    className="form-control"
                    placeholder="Enter new Hospital Email"
                    {...field}
                    label="Email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{ marginTop: "5px" }}
                  />
                )}
              />
              <Controller
                name="phoneNumber"
                control={control}
                defaultValue=""
                rules={{ required: 'phoneNumber is required' }}
                render={({ field }) => (
                  <TextField
                    type="number"
                    className="form-control"
                    placeholder="Enter new Hospital phoneNumber"
                    {...field}
                    label="phoneNumber"
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    sx={{ marginTop: "5px" }}
                  />
                )}
              /> */}
              <Controller
                name="addressLine1"
                control={control}
                defaultValue=""
                rules={{ required: 'addressLine1 is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    className="form-control"
                    placeholder="Enter new Hospital addressLine1"
                    {...field}
                    label="addressLine1"
                    error={!!errors.addressLine1}
                    helperText={errors.addressLine1?.message}
                    sx={{ marginTop: "5px" }}
                  />
                )}
              />
              <Controller
                name="addressLine2"
                control={control}
                defaultValue=""
                rules={{ required: 'addressLine2 is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    className="form-control"
                    placeholder="Enter new Hospital addressLine2"
                    {...field}
                    label="addressLine2"
                    error={!!errors.addressLine2}
                    helperText={errors.addressLine2?.message}
                    sx={{ marginTop: "5px" }}
                  />
                )}
              />
              <Box className={styles['modal_second_container']}>
                <Controller
                  name="city"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'city is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      className="form-control"
                      placeholder="Enter new Hospital city"
                      {...field}
                      label="city"
                      error={!!errors.city}
                      helperText={errors.city?.message}
                      sx={{ marginTop: "5px" }}
                    />
                  )}
                />
                {/* <Controller
                  name="stateCode"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'stateCode is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      className="form-control"
                      placeholder="Enter new Hospital stateCode"
                      {...field}
                      label="stateCode"
                      error={!!errors.stateCode}
                      helperText={errors.stateCode?.message}
                      sx={{ marginTop: "5px" }}
                    />
                  )}
                />
                <Controller
                  name="countryCode"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'countryCode is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      className="form-control"
                      placeholder="Enter new Hospital countryCode"
                      {...field}
                      label="countryCode"
                      error={!!errors.countryCode}
                      helperText={errors.countryCode?.message}
                      sx={{ marginTop: "5px" }}
                    />
                  )}
                /> */}
                <Controller
                  name="countryCode"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl sx={{ m: 1, width: 260 }} variant="outlined" >
                      <InputLabel>Country*</InputLabel>
                      <Select
                        {...field}
                        label="Country*"
                        error={!!errors.countryCode}

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
                {country ? (
                    <Controller
                      name="stateCode"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <FormControl sx={{ m: 1, width: 260 }} variant="outlined" >
                          <InputLabel>State</InputLabel>
                          <Select {...field} label="State" >
                            {stateOptions.map((stateData, index) => (
                              <MenuItem key={index} value={stateData.code}>
                                {stateData.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                ) : (
                    <Controller
                      name="stateCode"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <FormControl sx={{ m: 1, width: 260 }} variant="outlined" >
                          <InputLabel>State</InputLabel>
                          <Select {...field} label="State" >
                            <MenuItem value="Please">
                            Select a Country
                            </MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                )}
                {/* <Controller
                  name="stateCode"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl sx={{ m: 1, width: 260 }} variant="outlined" >
                      <InputLabel>State</InputLabel>
                      <Select {...field} label="State" >
                        {stateOptions.map((stateData, index) => (
                          <MenuItem key={index} value={stateData.code}>
                            {stateData.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                /> */}
                <Controller
                  name="postalCode"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'postalCode is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      className="form-control"
                      placeholder="Enter new Hospital postalCode"
                      {...field}
                      label="postalCode"
                      error={!!errors.postalCode}
                      helperText={errors.postalCode?.message}
                      sx={{ marginTop: "5px" }}
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>
          <Box className={styles['update_modal-buttons']}>
            <Button variant="contained" color="primary" type="submit">
              Add
            </Button>
            <Button variant="contained" color='inherit' onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </form>

      </Box>
    </Modal>
  );
}

export default AddHospitalComponent;
