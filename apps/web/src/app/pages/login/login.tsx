import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Grid } from '@mui/material';
import styles from './login.module.scss';
import loginImg from '../../../assets/loginImg.jpg';
// import logoImg from '../../../assets/Logo_Aqua level.svg';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

export interface LoginProps {
  onLogin: (user: any) => void;
}

export function Login({ onLogin }: LoginProps) {
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Must be a valid email')
      .required('Email is required'),
    password: yup.string().required('Password is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({ resolver: yupResolver(validationSchema) });
  const apiUrl = environment.apiUrl;
  const navigate = useNavigate();

  const onSubmit = async (formData: any) => {
    try {
      const res = await axios.post<any>(`${apiUrl}/login`, formData, {
        withCredentials: true,
      });
      const user = res.data;
      console.log(user);
      enqueueSnackbar('Login successfully', { variant: 'success' });
      // console

      // if(user || null){
      //   navigate("/dashboard")
      // }
      // if (user.organizationRoles[0].organizationRole === 'ADMIN') {
      //   // Only log in if the user has the 'ADMIN' superRole
      //   onLogin(user);
      //   // navigate("/dashboard");
      // } else {
      //   // Handle the case where the user doesn't have the 'ADMIN' superRole
      //   console.log('User does not have the required superRole to log in');
      // }
      onLogin(user);
      console.log('res', res);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
      enqueueSnackbar('Invalid Username or Password', { variant: 'error' });
    }
  };

  return (
    <Box className={styles['main_root']}>
      <Box className={styles['main_container']}>
        <Box className={styles['first_container']}>
          <Grid className={styles['image']}>
            <img
              src={loginImg}
              alt="Background"
              style={{ width: '60vh', height: '65vh', objectFit: 'cover' }}
            />
          </Grid>
        </Box>
        <Box className={styles['second_container']}>
          <Grid className={styles['logo_image']}>
            {/* <img
              // src={logoImg}
              alt="Background"
              style={{ marginTop: '30px', objectFit: 'cover' }}
            /> */}
          </Grid>
          <h2 style={{ fontFamily: 'Secular One' }}>SIGN IN</h2>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              sx={{ mb: '20px', width: 300 }}
              id="email"
              label="Email"
              variant="outlined"
              fullWidth
              error={!!errors.email}
              // helperText={errors.email?.message}
              {...register('email')}
            />
            <TextField
              sx={{ width: 300, fontFamily: 'Roboto' }}
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              {...register('password')}
              error={!!errors.password}
              // helperText={errors.password?.message}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: '20px', }}
              className={styles.button}
              // sx={{backgroundColor:"#054B7D"}}
            >
              Log In
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
