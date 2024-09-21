import React, { useContext, useEffect, useState } from 'react';
import styles from './login.module.scss';
import { environment } from '../../../environments/environment';
import Button from '@mui/material/Button';
import { Box, CssBaseline, Grid, IconButton, InputAdornment, Paper, TextField } from '@mui/material';
import axios, { AxiosError } from 'axios';
import { User, ViewUser } from '@healthcare/data-transfer-types';
import { UserContext } from '../../contexts/user-contexts';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { enqueueSnackbar } from 'notistack';
import { Link, useNavigate } from 'react-router-dom';
import loginImg from '../../../assets/LoginImage.jpg';
import logoImg from '../../../assets/DigiMedic_logo.svg';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '../../../assets/google.png';

/* eslint-disable-next-line */
export interface LoginProps {
  onLogin: (user: User) => void
}


export function Login({ onLogin }: LoginProps) {


  const usercontext = useContext(UserContext);
  const navigate=useNavigate();
  const apiUrl = environment.apiUrl;
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const validationSchema = yup.object().shape({
    email: yup.string().email('Must be a valid email').required('Email is required'),
    password: yup.string().required('Password is required'),

  });

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(validationSchema) });


  const handleOnSubmit = async (formData: { email: string; password: string; }) => {
    try {
      const { email, password } = formData;
      const res = await axios.post<User>(`${apiUrl}/login`, { email, password }, {
        withCredentials: true
      }
      );
      const user = res.data;
      onLogin(user);
      // navigate('/dashboard')
      // enqueueSnackbar("Login successfully!", { variant: 'success' });
      console.log('res', res);
    } catch (error) {
      
      console.log(error)
      enqueueSnackbar("Invalid username or password ", { variant: 'error' });
      console.log("Something went wrong")
    
  }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${environment.apiUrl}/auth/google`;
  };



  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
    <CssBaseline />
    <Grid
      item
      xs={false}
      sm={4}
      md={6}
      sx={{
        backgroundImage: `url(${loginImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundColor: (t) =>
          t.palette.mode === 'light'
            ? t.palette.grey[50]
            : t.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
    <Grid
      item
      xs={12}
      sm={8}
      md={6}
      component={Paper}
      square
      sx={{
        height: '100vh',
        overflow: 'auto',
      }}>
      <Box
        sx={{
          mx: 4,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
   <Box
  display="flex"
  flexDirection="column"
  alignItems="center"
>
  {/* <Box
    component={'img'}
    src={logoImg}
    sx={{ width: '6rem', height: 'auto', objectFit: 'cover', mb: 2 }}
  /> */}
  <Box
    component={'img'}
    src={logoImg}
    sx={{ width: '15rem', height: 'auto', objectFit: 'cover', mb: 4 }}
  />
</Box>

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(handleOnSubmit)}
          sx={{ mt: 1 }}>
          <TextField
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"
            required
            fullWidth
            id="email"
            label="email"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Button
              fullWidth
              variant="outlined"
              startIcon={<img src={GoogleIcon} alt="Google" style={{ width: '18px', height: '18px' }} />}
              sx={{ mb: 2 }}
              onClick={handleGoogleLogin}>
              Sign in with Google
            </Button>
        </Box>
      </Box>
    </Grid>
  </Grid>
  );


}

export default Login;
