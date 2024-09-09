import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/login/login';
import Layout from './Components/layout/layout';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useContext, useState, useEffect } from 'react';
import { Doctor, Hospital, Patient, User, ViewUser } from '@healthcare/data-transfer-types';
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
import EditPatientPage from './pages/list-patient/edit-patient-page/edit-patient-page';
import PatientLayout from './layouts/patient-layout/patient-layout';
import ListAppointments from "./pages/list-appoinment-new/list-appointments/list-appointments";
import ListAppointment from './pages/list-appointment/list-appointment';
import DoctorContext from './contexts/doctor-context';
import { PatientContext } from './contexts/patient-context';
import UserContext from './contexts/user-context';
import AddHospitalPage from './pages/list-hospitals/add-hospital-page/add-hospital-page';
import ListHospitals from './pages/list-hospitals/list-hospitals';
import EditHospitalPage from './pages/list-hospitals/edit-hospital-page/edit-hospital-page';
import ViewHospitalPage from './pages/list-hospitals/view-hospital-page/view-hospital-page';
import ListDoctors from './pages/list-doctor/list-doctor';
import HospitalListAppointment from './pages/hospital-list-appointment/hospital-list-appointment';
import MedicalHistory from './pages/medical-history/medical-history';
import DoctorLayout from './layouts/doctor-layout/doctor-layout';
import axios from 'axios';
import { environment } from '../environments/environment';
import HospitalContext from './contexts/hospital-context';
import AddPatientComponent from './pages/list-patient/add-patient-page/add-patient-page';
export function App() {

  const location = useLocation();
  // const [user, _setUser] = useState<User | null>(
  //   () => {
  //   const userFromStorage = localStorage.getItem('user');
  //   if (userFromStorage) {
  //     const user: User = JSON.parse(userFromStorage);
  //     return user;
  //   }
  //   return null;
  // }
  // );
  const [user, setUser]=useState<User | null>(null);
  const [doctor, setDoctor]=useState<Doctor | null>(null);
  const [patient, setPatient]=useState<Patient | null>(null);
  const [hospital, setHospital]=useState<Hospital | null>(null);
  const [doctorId, setDoctorId]=useState(0);
  const [hospitalId, sethospitalId]=useState(0);
  const apiUrl = environment.apiUrl;
// const setUser = (user: User | null) => {
//   if (user) {
//     localStorage.setItem('user', JSON.stringify(user));
//     _setUser(user);
//   } else {
//     localStorage.removeItem('user');
//     _setUser(null);
//   }
// };
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
    if (user.hospitalRoles?.length === 0) {
      enqueueSnackbar("User does not have a hospital manager role.", { variant: 'warning' });
      navigate("/login");
    }else if(user===null){
      navigate("/login");
    } else {
      setUser(user);
      navigate("/selectHospital");
      enqueueSnackbar("Login successfully!", { variant: 'success' });
    }
  }


   useEffect(()=>{
    if(user?.hospitalRoles?.map((role)=>role.hospitalRole==='DOCTOR')){
      user?.hospitalRoles?.map((role)=>
       { if(role.hospitalRole==='DOCTOR'){
          sethospitalId(role.hospitalId);
          setDoctorId(user && user?.id)
        }}
      )

    // const getDOCTOR = async () => {
    //     try {
    //       const response = await axios.get(
    //         `${apiUrl}/hospitals/${hospitalId}/doctors/${doctorId}`,
    //         {
    //           withCredentials: true,
    //         }
    //       );
    //       // console.log(response.data[0].user)
    //       const { content, total } = response.data;
    //       console.log('DOCTOR Data', response.data.content);
    //       setDoctor(response.data);
    //     } catch (error) {
    //       console.error('Error fetching doctor data:', error);
    //     }
    // }

    // getDOCTOR();


   }},[user]);

   
   


  //  useEffect(()=>{
  //   if(user?.hospitalRoles?.map((role)=>role.hospitalRole==='PATIENT')){
  //     user?.hospitalRoles?.map((role)=>
  //      { if(role.hospitalRole==='DOCTOR'){
  //         sethospitalId(role.hospitalId);
  //         setDoctorId(user && user?.id)
  //       }}
  //     )

  //   const getPatient = async () => {
  //       try {
  //         const response = await axios.get(
  //           `${apiUrl}/hospitals/${hospitalId}/doctors/${doctorId}`,
  //           {
  //             withCredentials: true,
  //           }
  //         );
  //         // console.log(response.data[0].user)
  //         const { content, total } = response.data;
  //         console.log('DOCTOR Data', response.data.content);
  //         setDoctor(response.data);
  //       } catch (error) {
  //         console.error('Error fetching doctor data:', error);
  //       }
  //   }

  //   getPatient();
  //  }},[]);



  // useEffect(() => {
  //   const userFromStorage = localStorage.getItem('user');
  //   if (userFromStorage !== null) {
  //     const user: User = JSON.parse(userFromStorage);
  //     setUser(user);
  //   }
  // }, []);
  console.log("doctor:", doctor)
  return (
    <UserContext.Provider value={{user, setUser}}>
    {/* <DoctorContext.Provider value={ {doctor, setDoctor}}> */}
    {/* <PatientContext.Provider value={{patient, setPatient}}> */}
    <HospitalContext.Provider value={{hospital,setHospital}}>
      <SnackbarProvider maxSnack={3}>
        <Routes>
       
          {/* <Route element={<HospitalLayout />}> */}
   
            <Route path="/" element={<Layout user={user}  />}>
              
              <Route path="/dashboard/:hospitalId" element={<Dashboard />} />
              {/* <Route element={<PatientLayout />}> */}
              {/* <Route path="/appointments/:hospitalId" element={<ListAppointment />} /> */}
              <Route path="/hospital/:hospitalId/patients" element={<ListPatients />} />
              <Route path="/hospital/:hospitalId/appointments" element={<ListAppointment/>} />
              <Route path="/hospital/:hospitalId/patients/add" element={<AddPatientPage />} />
              {/* <Route path="/hospital/:hospitalId/patients/edit/:patientId" element={<EditPatientPage />} /> */}
              <Route path="/hospitals/add" element={<AddHospitalPage />} />
              <Route path="/hospitals" element={<ListHospitals />} />
              <Route path="/hospitals/:hospitalId/edit" element={<EditHospitalPage />}/>
              <Route  path="/hospitals/:hospitalId/details"  element={<ViewHospitalPage />}/>
              <Route  path="/hospitals/:hospitalId/doctors"   element={<ListDoctors />}/>
              <Route  path="/hospitals/:hospitalId/appointments"  element={<HospitalListAppointment />}/>
              {/* <Route
                path="/hospitals/:hospitalId/doctors/:doctorId/patients"
                element={<ListPatients />}
              /> */}
          
              {/* <Route  path="/hospitals/:hospitalId/doctors/:doctorId/patients/add"  element={<AddPatientPage />}/> */}
              {/* <Route  path="/hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/edit"  element={<EditPatientPage />}/> */}
              <Route  path="/hospitals/:hospitalId/edit"  element={<EditHospitalPage />}/>
              <Route  path="/hospitals/:hospitalId/details"  element={<ViewHospitalPage />}/>
              <Route  path="/hospitals/:hospitalId/doctors"  element={<ListDoctors />}/>
              <Route  path="/hospitals/:hospitalId/patients"  element={<ListPatients />}/>
              {/* <Route  path="/hospitals/:hospitalId/patients/add"  element={<AddPatientPage />}/> */}
              <Route  path="/hospitals/:hospitalId/patients/edit/:patientId"  element={<EditPatientPage />}/>
              <Route path="/profile" element={<Profile />} />
              
            </Route>

            <Route path="/medical-history" element={<MedicalHistory />} />
              
           {/* doc portal */}
            <Route path="/hospitals/:hospitalId/doctors/:doctorId" element={<DoctorLayout/>}>
              <Route path="/hospitals/:hospitalId/doctors/:doctorId/dashboard" index element={<Dashboard />} />
              <Route  path="/hospitals/:hospitalId/doctors/:doctorId/patients/add"  element={<AddPatientComponent />}/>
              <Route  path="/hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/edit"  element={<EditPatientPage />}/>
              <Route path="/hospitals/:hospitalId/doctors/:doctorId/patients" element={<ListPatients />} />
              <Route path="/hospitals/:hospitalId/doctors/:doctorId/appointments" element={<ListAppointments/>} />
            </Route>

             {/* Patient Portal */}
            <Route path="/hospitals/:hospitalId/patients/:patientId" element={<PatientLayout/>}>
              {/* <Route path="/hospital/:hospitalId/doctors/:doctorId/patients/:patientId" element={<ListPatients />} /> */}
              <Route path="/hospitals/:hospitalId/patients/:patientId/dashboard" element={<Dashboard />} />
              <Route path="/hospitals/:hospitalId/patients/:patientId/appointments" element={<ListAppointments/>} />
            </Route>

              
            {/* </Route> */}
            
          {/* </Route> */}
          <Route path="/selectHospital" element={<SelectHospital />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password/email/:emailId/token/:token" element={<UpdatePassword />} />
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="/logout" element={<LogOut onLogout={onLogout} />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </SnackbarProvider>
      </HospitalContext.Provider>
      {/* </PatientContext.Provider> */}
      {/* </DoctorContext.Provider> */}
    </UserContext.Provider>
  );
}

export default App;
