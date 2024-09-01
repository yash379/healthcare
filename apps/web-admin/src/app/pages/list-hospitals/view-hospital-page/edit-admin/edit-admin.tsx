import styles from './edit-admin.module.scss';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useForm, Controller } from 'react-hook-form';
import { Button, Checkbox, Dialog, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
import { useTheme } from '@mui/system';
import CancelIcon from '@mui/icons-material/Cancel';

/* eslint-disable-next-line */
export interface EditAdminProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: Manager) => void;
  initialData: Manager | null;
}

// interface Form {
//   // id: number;
//   email: string;
//   phoneNumber: string;
//   firstName: string;
//   lastName: string;
// }

// interface Manager {
//   id: number;
//   user: {
//     id: number;
//     email: string;
//     phoneNumber: string;
//     firstName: string;
//     lastName: string;
//   }
// }


interface Manager {
  id: number;
  isPrimary: boolean;
  hospitalRole: {
    name: string;
  },
  user: {
    id: number;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
  }
}

export function EditAdmin({ open, onClose, onUpdate, initialData }: EditAdminProps) {
  const theme = useTheme();
  
  const validationSchema = yup.object().shape({
    user: yup.object().shape({
      firstName: yup.string().required('First name is required'),
      lastName: yup.string().required('Last name is required'),
      email: yup.string().required('Email is required'),
      phoneNumber: yup.string().matches(/[6789][0-9]{9}/, 'Invalid phone number').min(10).max(10).required('Phone number is required'),
    }),
    isPrimary: yup.boolean().notRequired(),
  });
  const { handleSubmit, control, reset, formState: { errors }, setValue } = useForm<Manager>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...initialData
    }
  });

  useEffect(() => {
    if (initialData) {
      setValue('user.firstName', initialData.user.firstName);
      setValue('user.lastName', initialData.user.lastName);
      setValue('user.email', initialData.user.email);
      setValue('user.phoneNumber', initialData.user.phoneNumber);
      // setValue('isPrimary',initialData.isPrimary);
    }
  }, [initialData, setValue]);



  const handleUpdate = (data: Manager) => {
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
Edit Hospital Manager
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
              name="user.firstName"
              control={control}
              defaultValue=""
              rules={{ required: 'Admin First Name is required' }}
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
                  {...field}
                  error={!!errors.user?.firstName}
                  helperText={errors.user?.firstName?.message}
                  sx={{
                    width: '100%',
                  }}
                />
              )}
            />
            </Box>
            <Box className={styles['grid_top']}>
            <Controller
              name="user.lastName"
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
                  size="medium"
                  {...field}
                  error={!!errors.user?.lastName}
                  helperText={errors.user?.lastName?.message}
                  sx={{
                    width: '100%',
                  }}
                />
              )}
            />
            </Box>
            <Box className={styles['grid_top']}>
            <Controller
              name="user.email"
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
                  {...field}
                  error={!!errors.user?.email}
                  helperText={errors.user?.email?.message}
                  sx={{
                    width: '100%',
                  }}
                />
              )}
            />
            </Box>
            <Box className={styles['grid_top']}>
            <Controller
              name="user.phoneNumber"
              control={control}
              defaultValue=""
              rules={{ required: 'Admin Phone Number is required' }}
              render={({ field }) => (
                <TextField
                  type="text"
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
                  error={!!errors.user?.phoneNumber}
                  helperText={errors.user?.phoneNumber?.message}
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
              {(initialData?.isPrimary === true) ?
              <Controller
                name="isPrimary"
                control={control}
                defaultValue={true}
                rules={{ required: 'Check if primary contact' }}
                render={({ field }) => (
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingLeft: "7px" }}>
                    <label htmlFor={field.name} style={{ fontSize: "medium", fontFamily: "poppins", }}>{
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
                    <Checkbox  disabled  {...field} sx={{ display: "flex", flexDirection: "row" ,  '&.Mui-disabled': {
                  color: theme.palette.primary.main, 
                   },}} defaultChecked />
                  </div>
                )} /> :
              <Controller
                name="isPrimary"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingLeft: "7px" }}>
                    <label htmlFor={field.name} style={{ fontSize: "medium", fontFamily: "poppins", }}>{
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
                    <Checkbox  {...field} sx={{ display: "flex", flexDirection: "row" }} />
                  </div>
                )}
              />
             }
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
              Save
            </Button>
            
          </Box>
        </form>
      </Box>
    </Dialog >
  );
}

export default EditAdmin;
