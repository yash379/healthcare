import styles from './edit-poyv-admin.module.scss';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useForm, Controller } from 'react-hook-form';
import { Button, Checkbox, Dialog, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';

/* eslint-disable-next-line */
export interface EditPOYVAdminProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: AddPOYVUser) => void;
  initialData: POYVUser | null;
}


interface POYVUser {
  id: number;
  superRole: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

interface AddPOYVUser {
  superRole: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

export function EditPOYVAdmin({ open, onClose, onUpdate, initialData }: EditPOYVAdminProps) {
  const validationSchema = yup.object().shape({
    superRole: yup.string().required('Please Select One'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().required('Email is required'),
    phoneNumber: yup.string().matches(/[6789][0-9]{9}/, 'Invalid phone number').min(10).max(10).required('Phone number is required'),
  });
  const { handleSubmit, control, reset, formState: { errors }, setValue } = useForm<AddPOYVUser>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...initialData
    }
  });

  useEffect(() => {
    if (initialData) {
      setValue('firstName', initialData.firstName);
      setValue('lastName', initialData.lastName);
      setValue('email', initialData.email);
      setValue('phoneNumber', initialData.phoneNumber);
      setValue("superRole", initialData.superRole)
    }
  }, [initialData, setValue]);



  const handleUpdate = (data: AddPOYVUser) => {
    console.log("on update", data);
    onUpdate(data);
    onClose();
    reset();
  };
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
        Edit User
        <IconButton
          onClick={() => {
            onClose();
            reset();
          }}
          aria-label="Close">
          <CancelIcon />
        </IconButton>
      </Typography>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <Box className={styles['modal_second_container']}>
          <Box className={styles['grid_top']}>
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              rules={{ required: 'Admin First Name is required' }}
              render={({ field }) => (
                <TextField
                  type="text"
                  label="First Name"
                  variant="outlined"
                  {...field}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  sx={{
                    width: '100%',
                  }}
                />
              )}
            />
              </Box>
              <Box className={styles['grid_top']}>
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              rules={{ required: 'Admin Last Name is required' }}
              render={({ field }) => (
                <TextField
                  type="text"
                  label="Last Name"
                  variant="outlined"
                  {...field}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  sx={{
                    width: '100%',
                  }}
                />
              )}
            />
              </Box>
              <Box className={styles['grid_top']}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{ required: 'Admin Email is required' }}
              render={({ field }) => (
                <TextField
                  type="text"
                  label="Email"
                  variant="outlined"
                  {...field}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{
                    width: '100%',
                  }}
                  inputProps={{ readOnly: true }}
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
              <InputLabel htmlFor="type" >Role*</InputLabel>
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

          <Box sx={{ mb: '5px', mt: '10px', textAlign: 'end' }}>
          <Button
              variant="contained"
              color="secondary"
              onClick={() => { onClose(); reset() }}
              sx={{ mr: '10px', borderRadius: '12px' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              Save
            </Button>
           
          </Box>
        </form>
        </Box>
        </Dialog>
  );
}

export default EditPOYVAdmin;
