import styles from './add-admin.module.scss';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useForm, Controller } from 'react-hook-form';
import { Button, Checkbox, Dialog, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';

/* eslint-disable-next-line */
export interface AddAdminProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Form) => void;
 }

 interface Form {
  // id: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  isPrimary:boolean;
}


export function AddAdmin({ open, onClose, onSubmit }: AddAdminProps) {

  const validationSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().required('Email is required'),
    phoneNumber: yup.string().matches(/[6789][0-9]{9}/, 'Invalid phone number').min(10).max(10).required('Phone number is required'),
    isPrimary:yup.boolean().notRequired(),
  });
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<Form>({
    resolver: yupResolver(validationSchema),
 
  });

  const handleFormSubmit = (data: Form) => {
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
        Add Hospital Manager
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
                variant="outlined"
                // size="medium"
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
                label={
                  <Box sx={{ display: 'flex'}}>
                   Last Name
                    <Typography
                      fontSize="medium"
                      color="error"
                      sx={{ ml: '3px' }}>
                      *
                    </Typography>
                  </Box>
                }
                variant="outlined"
                // size="medium"
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
                variant="outlined"
                // size="medium"
                sx={{
                  width: '100%',
                }}
                {...field}
                error={!!errors.email}
                helperText={errors.email?.message}
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
                label={
                  <Box sx={{ display: 'flex'}}>
                  Phone Number
                    <Typography
                      fontSize="medium"
                      color="error"
                      sx={{ ml: '3px' }}>
                      *
                    </Typography>
                  </Box>
                }
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
          <Box className={styles['grid_top']}>
          <Controller
            name="isPrimary"
            control={control}
            defaultValue={false}
            rules={{ required: 'Check if primary contact' }}
            render={({ field }) => (
              <div style={{display:"flex",flexDirection:"row",justifyContent:"flex-start",alignItems:"center", paddingLeft:"7px"}}>
              <label htmlFor={field.name} style={{fontSize:"medium",fontFamily:"poppins",}}>{
                      <Box sx={{ display: 'flex'}}>
                       Is it a Primary Contact?
                        <Typography
                          fontSize="medium"
                          color="error"
                          sx={{ ml: '3px' }}>
                          *
                        </Typography>
                      </Box>
                    }</label>
              <Checkbox  {...field} sx={{ display: "flex", flexDirection: "row" }}/>
              </div>
            )}
          />
          </Box>
        </Box>

        <Box sx={{ mb: '5px', mt: '10px', textAlign: 'end' }}>
        
          <Button
            variant="contained"
            color="secondary"
            sx={{ mr: "10px" }}
            onClick={()=>{onClose(); reset()}}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
       
          >
            Add
          </Button>
        </Box>
      </form>
      </Box>
    </Dialog>
  );
}

export default AddAdmin;
