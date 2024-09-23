import styles from './forgot-password.module.scss';
import { environment } from '../../../environments/environment';
import { UserContext } from '../../contexts/user-context';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '@healthcare/data-transfer-types';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { Button, TextField, CircularProgress, Divider, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import { Link, useNavigate, useParams } from 'react-router-dom';

/* eslint-disable-next-line */
export interface ForgotPasswordProps {}

export function ForgotPassword(props: ForgotPasswordProps) {
  const usercontext = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [linkSendSuccess, setLinkSendSuccess] = useState(false);
  const apiUrl = environment.apiUrl;
  const params = useParams();
  console.log('Params:', params);

  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Must be a valid email')
      .required('Email is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const handleOnSubmit = async (formData: { email: any }) => {
    console.log(formData, params.emailId, params.token);

    try {
      setLoading(true);
      const { email } = formData;
      const res = await axios.post(
        `${apiUrl}/forgot-password`,
        { email },
        {
          // headers: {
          //   Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          // },
          withCredentials: true,
        }
      );
      const user = res.data;
      // onLogin(user);
      // setEmailSent(true);
if(res.status===202){
  setLinkSendSuccess(true);
  enqueueSnackbar('Password Update link sent to Email successfully!', {
    variant: 'success',
  });
}
    
      console.log('res', res);
      // navigate('/login');
      setLoading(false);
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
      console.log('Something went wrong');
      setLoading(false);
    }
    // console.log("email sent",emailSent);
  };
  return (
    <>
      <div className={styles['login-page']}>
        <div className={styles['login-img']}></div>
        <div className={styles['form-container']}>
        {linkSendSuccess ?(
          <Typography variant="subtitle1" gutterBottom>
          Password Update link sent to Email successfully!
          </Typography>
         ):(
          <form onSubmit={handleSubmit(handleOnSubmit)}>
         
            <h1 style={{ display: 'flex' }}>Forgot Password</h1>
            <div className={styles['email']}>
              <TextField
                type="email"
                {...register('email')}
                label="Email"
                error={!!errors.email}
                helperText={errors.email?.message}
                className="form-control"
                placeholder="Enter Your Email Id"
                sx={{ width: '100%', mb: 2 }}
              />
            </div>
            <div>
              <Button
                type="submit"
                variant="contained"
                classes="btn btn-primary"
                className={styles['submit_btn']}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </form>
         )}
          <Divider
            sx={{ width: '100%', mt: '40px' }}
            className={styles['divider']}
            variant="middle"
          />
          <div className={styles['back-to-login']}>
            <Button className={styles['back-button']}  classes="btn btn-primary" onClick={() => navigate('/login')}>
              Back to Login
            </Button>
          </div>
        </div>
      </div>
      {/* {emailSent ? <Alert severity="success">Password Update link sent to Email successfully!</Alert>:<div/>} */}
    </>
  );
}

export default ForgotPassword;
