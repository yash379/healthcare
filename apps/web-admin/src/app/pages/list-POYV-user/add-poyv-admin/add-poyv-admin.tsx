import styles from './add-poyv-admin.module.scss';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useForm, Controller } from 'react-hook-form';
import { Button, Checkbox, Dialog, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
/* eslint-disable-next-line */
export interface AddPOYVAdminProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddPOYVUser) => void;
}

interface AddPOYVUser {
  superRole: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}


export function AddPOYVAdmin({ open, onClose, onSubmit }: AddPOYVAdminProps) {

  const validationSchema = yup.object().shape({
    superRole: yup.string().required('Please Select One'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().required('Email is required'),
    phoneNumber: yup.string().matches(/[6789][0-9]{9}/, 'Invalid phone number').min(10).max(10).required('Phone number is required'),
  });
  const { handleSubmit, control, reset,setValue, formState: { errors } } = useForm<AddPOYVUser>({
    resolver: yupResolver(validationSchema),

  });

  const handleFormSubmit = (data: AddPOYVUser) => {
    onSubmit(data);
 
  };

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth >
    <Box  p={"5px 24px 24px 24px"} >
      <Typography
       variant="h2"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '14px -10px 5px 0px',
        }}
        >
        Add User
        <IconButton
          onClick={() => {
            onClose();
            reset();
          }}
          aria-label="Close">
          <CancelIcon />
        </IconButton>
      </Typography>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box
          sx={{
            display: 'grid',
            columnGap: 2,
            rowGap: 1,
            
            // paddingRight: 3,
            // paddingLeft: 3,
            // padding: '0px 24px 0px 24px',
            // gridTemplateColumns: 'repeat(2, 1fr)',
            // '@media (max-width: 600px)': {
            //   gridTemplateColumns: '1fr',
            // },
          }}>
          <Box className={styles['modal_second_container']}>
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
                    label={
                      <Box sx={{ display: 'flex'}}>
                        First Name
                        <Typography
                          fontSize="medium"
                          color="error"
                          sx={{ ml: '3px', mb:"10px" }}>
                          *
                        </Typography>
                      </Box>
                    }
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
              
                    sx={{
                      width: '100%',
                    }}
                    inputProps={{ maxLength: 50 }}
                  />
                )}
              />
            </Box>
            <Box className={styles['grid_top']}>
              <Controller
                name="lastName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    type="text"
                    className="form-control"
                    placeholder="Enter Last Name"
                    {...field}
                    label="Last Name"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                 
                    sx={{
                      width: '100%',
                    }}
                    inputProps={{ maxLength: 50 }}
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
                    placeholder="Enter Email Address"
                    {...field}
                    label={
                      <Box sx={{ display: 'flex'}}>
                        Email Address
                        <Typography
                          fontSize="medium"
                          color="error"
                          sx={{ ml: '3px' }}>
                          *
                        </Typography>
                      </Box>
                    }
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    
                    sx={{
                      width: '100%',
                    }}
                    inputProps={{ maxLength: 254 }}
                  />
                )}
              />
            </Box>
            <Box className={styles['grid_top']}>
            <Controller
              name="phoneNumber"
              control={control}
              defaultValue=""
              rules={{ required: 'Admin Phone Number is required' }}
              render={({ field }) => (
                <TextField
                  type="text"
                  inputMode="numeric"
                  label="Phone Number"
                  variant="outlined"
                  {...field}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  sx={{
                    width: '100%',
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment sx={{mt:"1px"}} position="start">
                        +91
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            </Box>
            <Box sx={{ textAlignLast: 'start', marginTop: 2 }}>
            <FormControl sx={{width:'100%'}} error={!!errors.superRole}>
              <InputLabel htmlFor="type" >{
                      <Box sx={{ display: 'flex'}}>
                        Role
                        <Typography
                          fontSize="medium"
                          color="error"
                          sx={{ ml: '3px' }}>
                          *
                        </Typography>
                      </Box>
                    }</InputLabel>
              <Controller
                name="superRole"
                control={control}
                defaultValue={"ADMIN"}
                rules={{ required: 'SuperRole Name is Required' }}
                render={({ field }) => (
                  <Select
                    label="Role*"
                    variant="outlined"
                    {...field}
                    error={!!errors.superRole}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 97
                        },
                      },
                    }}
                  >
                    <MenuItem sx={{ justifyContent: "start" }} value="ADMIN">ADMIN</MenuItem>
                    {/* <MenuItem sx={{ justifyContent: "start" }} value="USER">USER</MenuItem> */}
                  </Select>
                )}
              />
              <FormHelperText>{errors.superRole?.message}</FormHelperText>
            </FormControl>
            </Box>
          </Box>
        </Box>


        <Box sx={{ mb: '5px', mt: '10px', textAlign: 'end' }}>
          <Button
            sx={{ mr: '10px', borderRadius: '12px' }}
            variant="contained"
            color="secondary"
            onClick={() => {
              onClose();
              reset();
            }}>
            Cancel
          </Button>
          <Button
            sx={{ borderRadius: '12px' }}
            variant="contained"
            color="primary"
            type="submit">
            Add
          </Button>
        </Box>
      </form>
    </Box>
  </Dialog>
  );
}

export default AddPOYVAdmin;
