import styles from './update-password.module.scss';
import { environment } from '../../../environments/environment';
import { UserContext } from '../../contexts/user-contexts';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { Button, CircularProgress, TextField } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';

/* eslint-disable-next-line */
export interface UpdatePasswordProps {}

export function UpdatePassword(props: UpdatePasswordProps) {
  const usercontext = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const apiUrl = environment.apiUrl;  
  const params=useParams();
  console.log("Params:",params);

  const navigate=useNavigate();

  const validationSchema = yup.object().shape({
    password: yup.string().required('Password is required'),
    reconfirmPassword:yup.string().required('ReConfirm Password'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(validationSchema) });


  const handleOnSubmit = async (formData: { password: any; reconfirmPassword: any}) => {
    console.log(formData, params.emailId,params.token);

        try {
          const { password } = formData;
          const email=params.emailId;
          const token=params.token;
          setLoading(true);
          const res = await axios.put(`${apiUrl}/update-password/email/${params.emailId}/token/${params.token}`, { email, password, token },
          {
            // headers: {
            //   Authorization: `Bearer ${token}`, // Send the token in the Authorization header
            // },
            withCredentials: true
          }
          );
          const user = res.data;
          enqueueSnackbar("Password Updated successfully!", { variant: 'success' });
          navigate('/login');
          console.log('res', res);
          setLoading(false);
        } catch (error) {
          console.log(error);
          if (axios.isAxiosError(error) && error.response?.status === 400) {
            // enqueueSnackbar("Something went wrong", { variant: 'error' });
            enqueueSnackbar(
              'Your password reset link is not valid, or already used.', { variant: 'error' }
            );
            console.log('Something went wrong');
            setLoading(false);
        }
        
      }
    
  }
  return (
    <div className={styles['login-page']}>
      <div className={styles['login-img']}></div>
      <div className={styles['form-container']}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
      {/* <div className={styles['logo']}><img src={POYV} alt="font lab logo" width="150px" height="23px"/></div> */}
      <h1 style={{display:'flex',}}>Update Password</h1>
      <div className={styles['subtitle']}>Set New Password</div>
        <div className={styles['password']}>
          <TextField type="password" 
          {...register('password')}
            label="Password"
            error={!!errors.password}
            helperText={errors.password?.message}
            className="form-control"
            placeholder='Enter Your Password'
            sx={{width:"100%"}}
             />
        </div>
        <div className={styles['reconfirmPassword']}>
          <TextField type="password"
          {...register('reconfirmPassword')}
            label="Confirm Password"
            error={!!errors.reconfirmPassword}
            helperText={errors.reconfirmPassword?.message}
            className="form-control"
            placeholder='Confirm Your Password'
            sx={{width:"100%"}}
             />
        </div>
        
        <div >
          <Button type="submit"
            variant="contained"
            classes="btn btn-primary" className={styles['submit_btn']}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
              </Button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default UpdatePassword;
