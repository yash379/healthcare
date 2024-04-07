import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/login/login';
import Layout from './Components/layout/layout';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { UserContext } from './contexts/user-context';
import { useContext, useState, useEffect } from 'react';
import { User } from '@healthcare/data-transfer-types';
import Dashboard from './pages/dashboard/dashboard';
import PageNotFound from './Components/page-not-found/page-not-found';
import HospitalLayout from './Routes/hospital-layout/hospital-layout';
import Profile from './Components/profile/profile';
import SelectHospital from './pages/select-hospital/select-hospital';
import LogOut from './Components/log-out/log-out';
import ForgotPassword from './pages/forgot-password/forgot-password';
import UpdatePassword from './pages/update-password/update-password';
import Security from './Components/security/security';
import ListPatients from './pages/list-patient/list-patient';
import AddPatientPage from './pages/list-patient/add-patient-page/add-patient-page';
export function App() {

  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  const usercontext = useContext(UserContext);
  console.log('User context:', usercontext);

  const onLogout = async () => {
    localStorage.removeItem('user');
    console.log("logout", user);
    setUser(null);
    navigate("/login");
  }

  const onLogin = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    // setUser(user);
    // console.log("onLogin", user);
    // // navigate("/dashboard");
    // navigate("/selectHospital");
    if (user.HospitalRole?.length === 0) {
      enqueueSnackbar("User does not have a hospital manager role.", { variant: 'warning' });
      navigate("/login");
    } else {
      setUser(user);
      navigate("/selectHospital");
      enqueueSnackbar("Login successfully!", { variant: 'success' });
    }
  }

  useEffect(() => {
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage !== null) {
      const user: User = JSON.parse(userFromStorage);
      setUser(user);
    }
  }, []);
  return (
    <UserContext.Provider value={user}>
      <SnackbarProvider maxSnack={3}>
        <Routes>
          <Route element={<HospitalLayout />}>
            <Route path="/" element={<Layout />}>

              <Route path="/dashboard/:hospitalId" element={<Dashboard />} />
              <Route path="/hospital/:hospitalId/patients" element={<ListPatients />} />
              <Route path="/hospital/:hospitalId/patients/add" element={<AddPatientPage />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
          <Route path="/selectHospital" element={<SelectHospital />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password/email/:emailId/token/:token" element={<UpdatePassword />} />
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="/logout" element={<LogOut onLogout={onLogout} />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </SnackbarProvider>
    </UserContext.Provider>
  );
}

export default App;
