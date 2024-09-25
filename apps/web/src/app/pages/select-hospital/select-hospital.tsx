import { useContext, useEffect, useState } from 'react';
import styles from './select-hospital.module.scss';
import { UserContext } from '../../contexts/user-context';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import { Box } from '@mui/material';
import { HospitalContext } from '../../contexts/hospital-context';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Gender } from '@prisma/client';
import { HospitalRoleDto } from '@healthcare/data-transfer-types';

/* eslint-disable-next-line */
export interface SelectHospitalProps {}

interface PatientResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  digitalHealthCode: string;
  gender: Gender;
  age: number;
  bloodGroup: string;
  dob: string; // ISO 8601 date string
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  countryCode: string;
  stateCode: string;
  chronicDiseases: [];
  acuteDiseases: [];
  doctors: Doctor[];
  isActive: boolean;
}


interface Doctor {
  doctorId: number;
  doctorGender: Gender;
  doctorDoctorCode: string;
  doctorSpeciality: string;
  doctorFirstName: string;
  doctorLastName: string;
  doctorEmail: string;
  doctorPhoneNumber: string;
}
export function SelectHospital(props: SelectHospitalProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState([0]);
  const usercontext=useContext(UserContext);
  const [patientdoctorId, setPatientDoctorId]=useState(0);
  const [patient, setPatient]=useState<PatientResponse | null>(null);
  const [hospitalId, setHospitalId]=useState<number | null>(null);
  const [roles,setRoles]=useState<HospitalRoleDto[]>();
  const navigate=useNavigate();
  const apiUrl = environment.apiUrl;

  const hospitalcontext=useContext(HospitalContext);
  console.log("user context:", usercontext);

  // useEffect(()=>{
  //   if(usercontext?.user && usercontext?.user?.hospitalRoles && usercontext?.user?.hospitalRoles.length > 1){
  //     return;
  //   }else{
  //     navigate(`/dashboard/${usercontext?.user && usercontext?.user?.hospitalRoles && usercontext?.user?.hospitalRoles[0].hospitalId}`);
  //     // navigate('/dashboard');
  //   }
  // },[usercontext?.user && usercontext?.user?.hospitalRoles && usercontext?.user?.hospitalRoles.length, navigate, usercontext?.user && usercontext?.user?.hospitalRoles]);


  const getHospital=async()=>{
     const response=await axios.get(
      `${apiUrl}/hospitals/${hospitalId}`,
      {
        withCredentials: true,
      }
    );
    hospitalContext?.setHospital(response.data);
    console.log("response hospitalId:", response.data);
  }



  useEffect(()=>{
    getHospital();
    setRoles(usercontext?.user?.hospitalRoles);
    localStorage.removeItem('doctor');
    localStorage.removeItem('patient');
  },[hospitalId,hospitalcontext,usercontext]);

  console.log("roles:", roles);
  
  
  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    console.log("value:",value)

    // Navigate to hospital dashboard when the checkbox is checked
    if (currentIndex === -1) {
      navigate(`/dashboard/${value}`); // Adjust the route as needed
      // navigate('/dashboard')
    }
  };

  // useEffect(()=>{
  //   console.log("patient doctor id:",patient?.doctors?.flatMap((item)=>{return item.doctorId}))
  //   console.log("patient doctor id:",patient?.doctors[0]?.doctorId);
  //   setPatientDoctorId(Number(patient?.doctors[0]?.doctorId));
  // },[patient]);

  // useEffect(()=>{
  //   const getPatient=
  // },[usercontext?.user?.patientId])

  const handleRadioChange = (Id: any, value:any) => () => {
    // setSelected(value);
    // hospitalcontext?.setHospital(value);
    // navigate(`/dashboard/${value}`);
    // navigate('/dashboard')
    setHospitalId(Id);
    console.log("id selected:", Id)
    // const getHospital=async()=>{
    //   try{
    //     const response=await axios.get(`${apiUrl}/hospitals/${Id}`,
    //       {
    //         withCredentials: true,
    //       }
    //     );
    //     console.log("Hospital:",response.data);
    //     hospitalcontext?.setHospital(response.data);
    //   }catch(error){
    //     console.error("Error in fecthing hospital:", error);
    //   }
    // }

    // getHospital();

    const getPatient=async()=>{
      const response=await axios.get(`${apiUrl}/hospitals/${Id}/patients/${usercontext?.user?.patientId}`,
        {
          withCredentials: true,
         }
      );
      const doctorid=response.data.map((item: { doctors: { doctorId: any; }[]; })=>{item.doctors.map((seconditem: { doctorId: any; })=> {setPatientDoctorId(seconditem.doctorId)})});
      // console.log("patient detail:", response.data, "doctorid:",doctorid,patientdoctorId);
      // response.data.map((item: any)=>{console.log(item)})
      setPatient(response.data)
      
    }
    getPatient();
    
    console.log("patient doctor id:",patient?.doctors?.flatMap((item)=>{console.log(item.doctorId)}))

    if(value==='ADMIN'){
      navigate(`/hospitals/${Id}/admin/${usercontext?.user?.id}`);
    }
    if(value==='DOCTOR'){
      navigate(`/hospitals/${Id}/doctors/${usercontext?.user?.doctorId}`);
    }
    if(value==='PATIENT'){
      navigate(`/hospitals/${Id}/patients/${usercontext?.user?.patientId}`)
    }
  };

  console.log("user context:",usercontext);
  console.log("user context scoietty:",usercontext?.user?.hospitalRoles);
  console.log("patiendoctotId:", patientdoctorId);
  // console.log("user context scoietty length:",usercontext?.user?.hospitalRoles length);

  const hospitalContext=useContext(HospitalContext);

  // useEffect(()=>{
  //   const id=usercontext?.user?.hospitalRoles?.map((item)=>{
  //     return item.hospitalId;
  //   })
  //  },[usercontext?.user]);


  return (
    
      <div className={styles['login-page']}>
        {/* <h1>Welcome to SelectHospital!</h1> */}
        <div className={styles['form-container']}>
          <Box className={styles['hospital-header']}>
             <h1>Select Hospital</h1>
          </Box>
          <div className={styles['hospital-list']}>
            <List sx={{ bgcolor: 'background.paper' }}>
                {roles?.map((value) => {
                    const labelId = `checkbox-list-label-${value.hospitalId}`;

                    return (
                      <ListItem key={value.hospitalId} disablePadding className={styles['hospital-list-item']}>
                        <ListItemButton role={undefined} onClick={handleRadioChange(value.hospitalId,value.hospitalRole)} dense>
                          <ListItemIcon>
                          <Radio
                            checked={selected === value.hospitalId}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                          </ListItemIcon>
                          <ListItemText id={labelId} primary={` ${value.hospitalId} ${value.hospitalName} ${value.hospitalRole}`} />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
            </List>
            </div>
        </div>
      </div>
  
  );

}

export default SelectHospital;
