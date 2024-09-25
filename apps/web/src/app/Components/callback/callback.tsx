import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { User } from '@healthcare/data-transfer-types';
import { CircularProgress, Box } from '@mui/material';
import { enqueueSnackbar } from 'notistack';

interface CallbackProps {
  onLogin: (user: User) => void;
}

const Callback: React.FC<CallbackProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const snackbarShownRef = useRef(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');

    const fetchUser = async () => {
      try {
        if (status && parseInt(status, 10) === 401 && !snackbarShownRef.current) {
          enqueueSnackbar('Unauthorized access', { variant: 'error' });
          snackbarShownRef.current = true;
          navigate('/login');
          return;
        }

        const response = await axios.get<User>(
          `${environment.apiUrl}/auth/current-user`,
          {
            withCredentials: true,
          },
        );

        onLogin(response.data);
      } catch (error) {
        if (!snackbarShownRef.current) {
          enqueueSnackbar('Error: Unable to fetch user information.', { variant: 'error' });
          snackbarShownRef.current = true;
        }
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate, onLogin, location.search]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
      <CircularProgress />
    </Box>
  );
};

export default Callback;
