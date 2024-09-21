import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Grid, Typography } from '@mui/material';
import styles from './login.module.scss';
import loginImg from '../../../assets/loginImg.jpg';
// import logoImg from '../../../assets/Logo_Aqua level.svg';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { User, ViewUser } from '@healthcare/data-transfer-types';
import digimedic from '../../../assets/DigiMedic_logo.svg';
import loginImage from '../../../assets/loginImage.png';
import UserContext from '../../contexts/user-context';

export interface LoginProps {
  onLogin: (user: User) => void;
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
  } = useForm({ resolver: yupResolver(validationSchema) });
  const apiUrl = environment.apiUrl;
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  const usercontext = useContext(UserContext);

  useEffect(()=>{
    const userrrr=localStorage.getItem('user');
    const userfromlocalstorage=JSON.stringify(userrrr);
     usercontext?.setUser(JSON.parse(userfromlocalstorage));
  },[usercontext?.user,user])

  const onSubmit = async (formData: { email: string; password: string }) => {
    try {
      const res = await axios.post<any>(`${apiUrl}/login`, formData, {
        withCredentials: true,
      });
      const user = res.data;
      console.log(user);
      setUser(user);
      usercontext?.setUser(user);
      // enqueueSnackbar('Login successfully', { variant: 'success' });
      // console
      // if (user || null) {
      // navigate("/dashboard")
      // }
      console.log(res);
      if (user.hospitalRoles.length > 0) {
        onLogin(user);
      } else {
        console.log('User does not have the required superRole to log in');
        // navigate('/login')
        enqueueSnackbar(`User does not have a hospital role. Can't login`, {
          variant: 'warning',
        });
      }
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
      enqueueSnackbar('Invalid Username or Password', { variant: 'error' });
    }
  };

  console.log('usercontext in user:', usercontext?.user);

  // const onSubmit = async (formData: { email: string; password: string }) => {
  //   try {
  //     const { email, password } = formData;
  //     const res = await axios.post<User>(
  //       `${apiUrl}/login`,
  //       { email, password },
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     const user = res.data;
  //     onLogin(user);
  //     enqueueSnackbar("Login successfully!", { variant: 'success' });
  //     console.log('res', res);
  //   } catch (error) {
  //     console.log(error);
  //     enqueueSnackbar('Invalid username or password ', { variant: 'error' });
  //     console.log('Something went wrong');
  //   }
  // };

  return (
    <Box className={styles['main_root']}>
      {/* <Box className={styles['main_container']}> */}
        <Box className={styles['second_container']}>
          {/* <Grid className={styles['logo_image']}> */}
            {/* <img
              // src={logoImg}
              alt="Background"
              style={{ marginTop: '30px', objectFit: 'cover' }}
            /> */}
          {/* </Grid> */}
          {/* <div > */}
          <img src={digimedic} alt="medi plus logo" width="300px" height="100px" className={styles['logo']}/>
          {/* </div> */}
          <h1 style={{ fontFamily: 'Secular One' }}>WELCOME!</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* <div className={styles['logo']}><img src={fountlab} alt="font lab logo" width="150px" height="23px"/></div> */}
            {/* <div className={styles['login-header']}>Welcome Back <span className={styles['login-emoji']}>👋</span></div> */}
            <div className={styles['login-form']}>
              {/* <Typography>Username</Typography> */}
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
              {/* <Typography>Password</Typography> */}
                <TextField
                  type="password"
                  {...register('password')}
                  label="Password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  className="form-control"
                  placeholder="Enter Your Password"
                  sx={{ width: '100%' }}
                />
              </div>
              <div className={styles['forgot-password']}>
                <Link to="/forgot-password" style={{ textDecoration: 'none', color:'#064B4FD1' }}>
                  Forgot Password?
                </Link>
              </div>
            </div>

          <div className={styles['submit_btn']}>
            <Button
              type="submit"
              className="btn btn-primary"
              sx={{
                width: '100%',
                backgroundColor: '#064B4F',
                color: 'white',
                marginTop: '10px',
              }}
            >
              Log In
            </Button>
          </div>
        </form>
      </Box>
      <Box className={styles['first_container']}>
        {/* <Grid className={styles['image']}> */}
        <img
          src={loginImage}
          alt="Background"
          // style={{
          //   width: '50vh', // Ensure the image does not exceed the container width
          //   height: '65vh', // Allow the height to adjust proportionally
          //   objectFit: 'cover', // Maintain aspect ratio and cover the entire container
          //   borderTopLeftRadius: '40px',
          //   borderBottomLeftRadius: '40px',
          className={styles['loginImg']}
          // }}
        />

        {/* </Grid> */}
      </Box>
      {/* </Box> */}
    </Box>
  );
}

export default Login;
