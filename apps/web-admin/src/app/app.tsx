// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import axios from 'axios';
import { UserContext } from '../app/contexts/user-contexts';
import { User } from '@healthcare/data-transfer-types'
import { useState, useEffect, Component } from 'react';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import ListHospitals from './pages/list-hospitals/list-hospitals';
import LogOut from '../app/Components/logout/logout';
import Login from '../app/Components/login/login';
import Layout from './Components/layout/layout';
import ProtectedRoute from './Routes/protected-route/protected-route';
import View from './pages/view/view';

import AddHospitalPage from './pages/list-hospitals/add-hospital-page/add-hospital-page';
import EditHospitalPage from './pages/list-hospitals/edit-hospital-page/edit-hospital-page';
import ViewHospitalPage from './pages/list-hospitals/view-hospital-page/view-hospital-page';
// import ListResidents from './pages/list-resident/list-resident';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import HospitalLayout from './Routes/hospital-layout/hospital-layout';
import ListFLUser from './pages/list-FL-user/list-fl-user';
import PageNotFound from './Components/page-not-found/page-not-found';
import Profile from './Components/profile/profile';
import { Dashboard } from './pages/dashboard/dashboard';
import UpdatePassword from './pages/update-password/update-password';
import ForgetPassword from './pages/forget-password/forget-password';
import ListDoctors from './pages/list-doctor/list-doctor';

export function App() {

  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const params = useParams()

  // const shouldRenderLayout = location.pathname !== '*';
  const validRoutes = ['/login'];

  const shouldRenderLayout = validRoutes.includes(location.pathname);

  const navigate = useNavigate();

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
    // navigate("/hospitals");
    if (!user?.superRole) {
      enqueueSnackbar("User does not have a Super Role. Can't log in.", { variant: 'warning' });
      navigate("/login");
    } else {
      setUser(user);
      enqueueSnackbar("Login successfully!", { variant: 'success' });
      navigate("/dashboard");
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
    <div>
      <UserContext.Provider value={user}>
        <SnackbarProvider maxSnack={3}>
          <Routes>
          <Route path="/" element={<Layout/>}>
            {/* <Route path="/hospitals/:id" element={<View/>}/> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hospitals" element={<ListHospitals />}/>
            <Route path="/hospitals/add" element={<AddHospitalPage/>}/>
            <Route  element={<HospitalLayout/>}>
      
              <Route path="/hospitals/:hospitalId/edit" element={<EditHospitalPage/>}/> 
              <Route path="/hospitals/:hospitalId" element={<View/>}/>
              <Route path="/hospitals/:hospitalId/details" element={<ViewHospitalPage/>}/>
              <Route path="/hospitals/:hospitalId/doctors" element={<ListDoctors/>}/>

              <Route path="/profile" element={<Profile />}/>
            </Route>
            <Route path="/users"  element={<ListFLUser />}/>
            </Route>
          <Route path="/forgot-password" element={<ForgetPassword/>}/>
          <Route path="/update-password/email/:emailId/token/:token" element={<UpdatePassword/>} />
          <Route path="/logout" element={<LogOut onLogout={onLogout} />} />
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="*" element={<PageNotFound/>}/>
          </Routes>
        </SnackbarProvider>
      </UserContext.Provider>

    </div>
  );
}

export default App;
