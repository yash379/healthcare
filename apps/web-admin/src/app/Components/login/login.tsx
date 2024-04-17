import React, { useContext, useEffect, useState } from 'react';
import styles from './login.module.scss';
import { environment } from '../../../environments/environment';
import Button from '@mui/material/Button';
import { Box, Grid, TextField } from '@mui/material';
import axios, { AxiosError } from 'axios';
import { User } from '@healthcare/data-transfer-types';
import { UserContext } from '../../contexts/user-contexts';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { enqueueSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import loginImg from '../../../assets/loginImg.jpg';

/* eslint-disable-next-line */
export interface LoginProps {
  onLogin: (user: User) => void
}


export function Login({ onLogin }: LoginProps) {


  const usercontext = useContext(UserContext);

  const apiUrl = environment.apiUrl;

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
      // enqueueSnackbar("Login successfully!", { variant: 'success' });
      console.log('res', res);
    } catch (error) {
      
      console.log(error)
      enqueueSnackbar("Invalid username or password ", { variant: 'error' });
      console.log("Something went wrong")
    
  }
  }


  return (
    <Box className={styles['main_root']}>
    <Box className={styles['main_container']}>
      <Box className={styles['first_container']}>
        <Grid className={styles['image']}>
          <img
            src={loginImg}
            alt="Background"
            // style={{
            //   width: '50vh',
            //   height: '65vh',
            //   objectFit: 'cover',
            //   borderTopLeftRadius: '40px',
            //   borderBottomLeftRadius: '40px',
            // }}
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
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          {/* <div className={styles['logo']}><img src={fountlab} alt="font lab logo" width="150px" height="23px"/></div> */}
          {/* <div className={styles['login-header']}>Welcome Back <span className={styles['login-emoji']}>👋</span></div> */}
          <div className={styles['login-form']}>
            <div className={styles['email']}>
              <TextField
                type="email"
                {...register('email')}
                label="Email"
                error={!!errors.email}
                helperText={
                  errors.email && errors.email.message
                    ? errors.email.message
                    : ''
                }
                fullWidth
                className="form-control"
                placeholder="Enter Your Email Id"
              />
            </div>
            <div className={styles['password']}>
              <TextField
                type="password"
                {...register('password')}
                label="Password"
                error={!!errors.password}
                helperText={errors.password?.message}
                className="form-control"
                placeholder="Enter Your Password"
                sx={{ width: '280px' }}
              />
            </div>
            <div className={styles['forgot-password']}>
              <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className={styles['submit_btn']}>
            <Button
              type="submit"
              variant="contained"
              className="btn btn-primary"
              sx={{width:"110px", height:"40px"}}
            >
              Log In
            </Button>
          </div>
        </form>
      </Box>
    </Box>
  </Box>
  );


}

export default Login;
