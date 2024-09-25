import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/login/login';
import Layout from './Components/layout/layout';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useContext, useState, useEffect,useRef } from 'react';
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
import ViewMedicalHistoryTimeline from './view-medical-history-timeline/view-medical-history-timeline';
import PatientDetail from './pages/patient-detail/patient-detail';
import SettingPage from './setting-page/setting-page';
import DoctorAppointmentCalender from './doctor-appointment-calender/doctor-appointment-calender';
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
import ViewAppointmentDetail from './pages/hospital-list-appointment/view-appointment-detail/view-appointment-detail';
import DiagnosisPage from './pages/diagnosis-page/diagnosis-page';
import BrainTumor from './pages/brain-tumor/brain-tumor';
import Summarizer from './pages/ai-summarizer/ai-summarizer';
import AppointmentScheduler from './pages/appointment-scheduler/appointment-scheduler';
import PatientDashboard from './pages/patient-dashboard/patient-pages/Dashboard';
import AppointmentPage from './pages/patient-dashboard/patient-pages/AppointmentPage';
import MedicalReport from './pages/patient-dashboard/patient-pages/MedicalReport';
import ListPatientAppointments from  './pages/patient-dashboard/list-appointments/list-appointments';
import AdminLayout from './layouts/admin-layout/admin-layout';
import ListAdminPatients from './pages/admin-portal/list-patient/list-patient';
import AdminDashboard from './pages/admin-dashboard/admin-dashboard';
import AppointmentLayout from './layouts/appointment-layout/appointment-layout';
import PatientView from './pages/patient-dashboard/patient-view/patient-view';
import ListPatientsCards from './pages/list-patients-cards/list-patients-cards';
import Callback from './Components/callback/callback';
import SaranshAi from './pages/saransh-ai/saransh-ai';
import { PatientDetailFromPatient } from './pages/patient-detail-from-patient/patient-detail-from-patient';

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
  const snackbarShownRef = useRef(false);
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
  const doctorcontext=useContext(DoctorContext);
  const patientcontext=useContext(PatientContext);
  const hospitalcontext=useContext(HospitalContext);

  const onLogout = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('doctor');
    localStorage.removeItem('patient');
    console.log("logout", user);
    setUser(null);
    navigate("/login");
  }

  useEffect(()=>{
    const userfromlocalstorage=localStorage.getItem('user');
    // const userfromlocalstorage=JSON.stringify(userrrr);
    if(userfromlocalstorage){
      usercontext?.setUser(JSON.parse(userfromlocalstorage ?? ''));
      setUser(JSON.parse(userfromlocalstorage ?? ''));
      navigate("/selectHospital");
    }else{
      navigate('/login');
    } 
  },[]);

  useEffect(()=>{
    const doctorfromlocalstorage=localStorage.getItem('doctor');
    if(doctorfromlocalstorage){
      // const doctor=JSON.parse(doctorfromlocalstorage ?? '');
      doctorcontext?.setDoctor(JSON.parse(doctorfromlocalstorage ?? ''));
      setDoctor(JSON.parse(doctorfromlocalstorage ?? ''));
      navigate(`/hospitals/${hospital?.id}/doctors/${doctor?.id}`);
    }
  },[doctorcontext?.doctor, hospital?.id]);


  useEffect(()=>{
    const patientfromlocalstorage=localStorage.getItem('patient');
    if(patientfromlocalstorage){
      // const patient=JSON.parse(patientfromlocalstorage ?? '');
      patientcontext?.setPatient(JSON.parse(patientfromlocalstorage ?? ''));
      setPatient(JSON.parse(patientfromlocalstorage ?? ''));
      navigate(`/hospitals/${hospital?.id}/patients/${patient?.id}`);
    } 
  },[patientcontext?.patient, hospital?.id]);

  // console.log("doctorcontet:",doctorcontext);

  const onLogin = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));

    
    // setUser(user);
    // console.log("onLogin", user);
    // // navigate("/dashboard");
    // navigate("/selectHospital");
    // if (user.hospitalRoles?.length === 0) {
    //   enqueueSnackbar("User does not have a hospital manager role.", { variant: 'warning' });
    //   navigate("/login");
    // }else if(user===null){
    //   navigate("/login");
    // } else {
    //   setUser(user);
    //   navigate("/selectHospital");
    //   enqueueSnackbar("Login successfully!", { variant: 'success' });
    // }

    if(user===null){
      navigate("/login");
    } else {
      setUser(user);
      if(user?.hospitalRoles?.length && user?.hospitalRoles?.length>1){
        navigate("/selectHospital");
      }else{
        (user?.hospitalRoles?.map((item)=>
        {  
          if(item.hospitalRole==='DOCTOR'){
            navigate(`/hospitals/${item.hospitalId}/doctors/${user.doctorId}`);
          }else if(item.hospitalRole==='PATIENT'){
             navigate(`/hospitals/${item.hospitalId}/patients/${user.patientId}`);
          }else{
            navigate(`/hospitals/${item.hospitalId}/admin/${user.id}`);
          }
        }
        ));
      }
      // navigate("/selectHospital");
      if (!snackbarShownRef.current) {
      enqueueSnackbar("Login successfully!", { variant: 'success' });
      }
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
         
              {/* admin portal */}
               <Route path="/hospitals/:hospitalId/admin/:adminId" element={<AdminLayout/>}>
                 <Route path="/hospitals/:hospitalId/admin/:adminId" index element={<AdminDashboard />} />
                 <Route  path="/hospitals/:hospitalId/admin/:adminId/doctors"   element={<ListDoctors />}/>
                 <Route path="/hospitals/:hospitalId/admin/:adminId/patients" element={<ListAdminPatients/>} />
                 <Route path="/hospitals/:hospitalId/admin/:adminId/appointments" element={<ListAppointment/>} />
                 <Route path="/hospitals/:hospitalId/admin/:adminId/profile" element={<Profile />} />
               </Route>

             
              <Route path="/hospital/:hospitalId/patients/add" element={<AddPatientPage />} />
              {/* <Route path="/profile" element={<Profile />} />  */}
               {/* <Route element={<PatientLayout />}> */}
              {/* <Route path="/appointments/:hospitalId" element={<ListAppointment />} /> */}
              {/* <Route path="/hospital/:hospitalId/patients/edit/:patientId" element={<EditPatientPage />} /> */}
              {/* <Route path="/hospitals/add" element={<AddHospitalPage />} />
              <Route path="/hospitals" element={<ListHospitals />} />
              <Route path="/hospitals/:hospitalId/edit" element={<EditHospitalPage />}/>
              <Route  path="/hospitals/:hospitalId/details"  element={<ViewHospitalPage />}/>
              
              <Route  path="/hospitals/:hospitalId/appointments"  element={<HospitalListAppointment />}/> */}
              {/* <Route
                path="/hospitals/:hospitalId/doctors/:doctorId/patients"
                element={<ListPatients />}
              /> */}
          
              {/* <Route  path="/hospitals/:hospitalId/doctors/:doctorId/patients/add"  element={<AddPatientPage />}/> */}
              {/* <Route  path="/hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/edit"  element={<EditPatientPage />}/> */}
              {/* <Route  path="/hospitals/:hospitalId/edit"  element={<EditHospitalPage />}/>
              <Route  path="/hospitals/:hospitalId/details"  element={<ViewHospitalPage />}/>
              <Route  path="/hospitals/:hospitalId/doctors"  element={<ListDoctors />}/>
              <Route  path="/hospitals/:hospitalId/patients"  element={<ListPatients />}/> */}
              {/* <Route  path="/hospitals/:hospitalId/patients/add"  element={<AddPatientPage />}/> */}
              {/* <Route  path="/hospitals/:hospitalId/patients/edit/:patientId"  element={<EditPatientPage />}/> */}
              
            <Route path="/view-medical-history-timeline" element={<ViewMedicalHistoryTimeline patient={null} />} /> 
              {/* <Route path="/patient-detail" element={<PatientDetail />} /> */}
              {/* <Route path="/doctor-appointment-calender" element={<DoctorAppointmentCalender />} /> */}
              
             

            
              
           {/* doc portal */}
            <Route path="/hospitals/:hospitalId/doctors/:doctorId" element={<DoctorLayout/>}>
              <Route path="/hospitals/:hospitalId/doctors/:doctorId" index element={<Dashboard />} />
              <Route  path="/hospitals/:hospitalId/doctors/:doctorId/patients/add"  element={<AddPatientComponent />}/>
              <Route  path="/hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/edit"  element={<EditPatientPage />}/>
              <Route path="/hospitals/:hospitalId/doctors/:doctorId/patients-list" element={<ListPatients />} />
              <Route path="/hospitals/:hospitalId/doctors/:doctorId/patients" element={<ListPatientsCards patients={[]} onEditPatient={function (index: number, updatedPatient: Patient): void {
                  throw new Error('Function not implemented.');
                } } onDeletePatient={function (index: number): void {
                  throw new Error('Function not implemented.');
                } } />} />
              <Route element={<AppointmentLayout/>}>
              <Route path="/hospitals/:hospitalId/doctors/:doctorId/appointments" element={<ListAppointments/>} />
              <Route path="/hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/patient-detail" element={<PatientDetail />} />
              <Route path="/hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/diagnosis" element={<DiagnosisPage />} />
              </Route>
              <Route path="/hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/patient-detail-from-patient" element={<PatientDetailFromPatient />} />
              {/* <Route path="/hospitals/:hospitalId/doctors/:doctorId/appointments/:id" element={<ViewAppointmentDetail />} /> */}
              <Route path="/hospitals/:hospitalId/doctors/:doctorId/view-medical-history-timeline" element={<ViewMedicalHistoryTimeline patient={null} />} />
              <Route path="/hospitals/:hospitalId/doctors/:doctorId/patients/:patientId/medical-history" element={<MedicalHistory />} />
              {/* <Route path="/hospitals/:hospitalId/doctors/:doctorId/cancer-detection" element={<BrainTumor />} /> */}
              {/* <Route path="/hospitals/:hospitalId/doctors/:doctorId/ai-summarizer" element={<Summarizer />} /> */}
              <Route path="/hospitals/:hospitalId/doctors/:doctorId/cancer-detection" element={<BrainTumor />} />
              <Route path="/hospitals/:hospitalId/doctors/:doctorId/saransh-ai" element={<SaranshAi />} />
              <Route path="/hospitals/:hospitalId/doctors/:doctorId/settings" element={<SettingPage />} />
              <Route path="/hospitals/:hospitalId/doctors/:doctorId/scheduler" element={<AppointmentScheduler/>}/>
              <Route path="/hospitals/:hospitalId/doctors/:doctorId/profile" element={<Profile />} />
              {/* <Route path="/profile" element={<Profile />} />  */}
            </Route>

             {/* Patient Portal */}
            <Route path="/hospitals/:hospitalId/patients/:patientId" element={<PatientLayout/>}>
              {/* <Route path="/hospital/:hospitalId/doctors/:doctorId/patients/:patientId" element={<ListPatients />} /> */}
              {/* <Route path="/hospitals/:hospitalId/patients/:patientId/dashboard" element={<Dashboard />} /> */}
              <Route path="/hospitals/:hospitalId/patients/:patientId" index element={<PatientDashboard/>} />
              <Route element={<AppointmentLayout/>}>
              <Route path="/hospitals/:hospitalId/patients/:patientId/patient-detail" element={<PatientView/>} />
              <Route path="/hospitals/:hospitalId/patients/:patientId/appointments" element={<ListPatientAppointments/>} />
              </Route>
              <Route path="/hospitals/:hospitalId/patients/:patientId/appointmentsview" element={<AppointmentPage/>} />
              <Route path="/hospitals/:hospitalId/patients/:patientId/medical-report" element={<MedicalReport/>} />
              <Route path="/hospitals/:hospitalId/patients/:patientId/ai-summarizer" element={<Summarizer />} />
              <Route path="/hospitals/:hospitalId/patients/:patientId/settings" element={<SettingPage />} />
              {/* <Route path="/profile" element={<Profile />} />  */}
              <Route path="/hospitals/:hospitalId/patients/:patientId/profile" element={<Profile />} />
            </Route>

              
            {/* </Route> */}
            
          {/* </Route> */}
          <Route path="/selectHospital" element={<SelectHospital />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password/email/:emailId/token/:token" element={<UpdatePassword />} />
          <Route path="/callback" element={<Callback onLogin={onLogin} />} />
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="/logout" element={<LogOut onLogout={onLogout} />} />
          <Route path="*" element={<PageNotFound />} />

          </Route>
          
        </Routes>
      </SnackbarProvider>
      </HospitalContext.Provider>
      {/* </PatientContext.Provider> */}
      {/* </DoctorContext.Provider> */}
    </UserContext.Provider>
  );
}

export default App;
