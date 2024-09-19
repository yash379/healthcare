// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import axios from 'axios';
import { UserContext } from '../app/contexts/user-contexts';
import { User, ViewUser } from '@healthcare/data-transfer-types';
import { useState, useEffect, Component } from 'react';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
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
import PageNotFound from './Components/page-not-found/page-not-found';
import Profile from './Components/profile/profile';
import { Dashboard } from './pages/dashboard/dashboard';
import UpdatePassword from './pages/update-password/update-password';
import ForgetPassword from './pages/forget-password/forget-password';
import ListDoctors from './pages/list-doctor/list-doctor';
import ListPatients from './pages/list-patient/list-patient';
import AddPatientPage from './pages/list-patient/add-patient-page/add-patient-page';
import EditPatientPage from './pages/list-patient/edit-patient-page/edit-patient-page';
import ListPOYVUser from './pages/list-POYV-user/list-poyv-user';
import MedicalHistory from './pages/medical-history/medical-history';
import AddAppointment from './pages/list-appointment/add-appointment/add-appointment';
import ListAppointment from './pages/list-appointment/list-appointment';
import EditAppointment from './pages/list-appointment/edit-appointment/edit-appointment';
import DeleteAppointment from './pages/list-appointment/delete-appointment/delete-appointment';
import AllAppointmentLog from './pages/list-appointment/all-appointment-log/all-appointment-log';
import ViewAppointmentDetail from './pages/hospital-list-appointment/view-appointment-detail/view-appointment-detail';
import DiagnosisPage from './pages/diagnosis-page/diagnosis-page';
import BrainTumor from './pages/brain-tumor/brain-tumor';
import HospitalListAppointment from './pages/hospital-list-appointment/hospital-list-appointment';
import SaranshAi from './pages/saransh-ai/saransh-ai';
import LatestPrescription from './pages/latest-prescription/latest-prescription';
import PatientDetail from './pages/list-patient/patient-detail/patient-detail';

export function App() {
  const location = useLocation();
  const [user, _setUser] = useState<User | null>(() => {
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      const user: User = JSON.parse(userFromStorage);
      return user;
    }
    return null;
  });
  const setUser = (user: User | null) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      _setUser(user);
    } else {
      localStorage.removeItem('user');
      _setUser(null);
    }
  };

  const navigate = useNavigate();

  const onLogout = async () => {
    localStorage.removeItem('user');
    console.log('logout', user);
    setUser(null);
    navigate('/login');
  };

  const onLogin = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    if (!user?.superRole) {
      enqueueSnackbar("User does not have a Super Role. Can't log in.", {
        variant: 'warning',
      });
      navigate('/login');
    } else {
      setUser(user);
      enqueueSnackbar('Login successfully!', { variant: 'success' });
      navigate('/dashboard');
    }
  };

  // useEffect(() => {
  //   const userFromStorage = localStorage.getItem('user');
  //   if (userFromStorage !== null) {
  //     const user: User = JSON.parse(userFromStorage);
  //     setUser(user);
  //   }

  // }, []);
  return (
    <div>
      <SnackbarProvider maxSnack={3}>
        <Routes>
          <Route path="/" element={<Layout user={user} />}>
            {/* <Route path="/hospitals/:id" element={<View/>}/> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hospitals" element={<ListHospitals />} />
            <Route path="/hospitals/add" element={<AddHospitalPage />} />

            <Route element={<HospitalLayout />}>
              <Route
                path="/hospitals/:hospitalId/edit"
                element={<EditHospitalPage />}
              />
              <Route path="/hospitals/:hospitalId" element={<View />} />
              <Route
                path="/hospitals/:hospitalId/details"
                element={<ViewHospitalPage />}
              />
              <Route
                path="/hospitals/:hospitalId/doctors"
                element={<ListDoctors />}
              />
              <Route
                path="/hospitals/:hospitalId/appointments"
                element={<HospitalListAppointment />}
              />
              <Route
                path="/hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/appointments/:appointmentId/view-appointment"
                element={<ViewAppointmentDetail />}
              />
              <Route
                path="/hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/appointments/:appointmentId/diagnosis"
                element={<DiagnosisPage />}
              />
              <Route
                path="/hospitals/:hospitalId/doctors/:doctorId/patients"
                element={<ListPatients />}
              />
                    <Route path="/hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/medical-history" element={<MedicalHistory />} />
              <Route path="/hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/appointments/:appointmentId/medical-history" element={<MedicalHistory />} />
              <Route path="/hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/appointments/:appointmentId/latest-prescription" element={<LatestPrescription />} />

              <Route
                path="/hospitals/:hospitalId/doctors/:doctorId/patients/add"
                element={<AddPatientPage />}
              />
              <Route
                path="/hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/edit"
                element={<EditPatientPage />}
              />
              <Route path="/profile" element={<Profile />} />

              <Route path="/appointments" element={<ListAppointment />} />
              <Route path="/add-appointment" element={<AddAppointment />} />
              <Route path="/edit-appointment" element={<EditAppointment />} />
              <Route
                path="/delete-appointment"
                element={<DeleteAppointment />}
              />
              <Route
                path="/appointments/:id"
                element={<ViewAppointmentDetail />}
              />
                  <Route path="/hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/patient-detail" element={<PatientDetail />} />
              <Route path="/diagnosis" element={<DiagnosisPage />} />
              <Route path="/cancer-detection" element={<BrainTumor />} />
              <Route path="/saransh-ai" element={<SaranshAi />} />

            </Route>

            <Route path="/hospitals" element={<ListHospitals />} />
            <Route path="/hospitals/add" element={<AddHospitalPage />} />

            <Route element={<HospitalLayout />}>
              <Route
                path="/hospitals/:hospitalId/edit"
                element={<EditHospitalPage />}
              />
              <Route path="/hospitals/:hospitalId" element={<View />} />
              <Route
                path="/hospitals/:hospitalId/details"
                element={<ViewHospitalPage />}
              />
              <Route
                path="/hospitals/:hospitalId/doctors"
                element={<ListDoctors />}
              />
              <Route
                path="/hospitals/:hospitalId/patients"
                element={<ListPatients />}
              />
              <Route
                path="/hospitals/:hospitalId/patients/add"
                element={<AddPatientPage />}
              />
              <Route
                path="/hospitals/:hospitalId/patients/edit/:patientId"
                element={<EditPatientPage />}
              />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/users" element={<ListPOYVUser />} />
          </Route>
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route
            path="/update-password/email/:emailId/token/:token"
            element={<UpdatePassword />}
          />
          <Route path="/logout" element={<LogOut onLogout={onLogout} />} />
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </SnackbarProvider>
    </div>
  );
}

export default App;
