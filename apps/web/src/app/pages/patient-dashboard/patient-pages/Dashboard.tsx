import React, { useContext, useEffect, useState } from 'react'
import MedicalHistory from '../medical-history/medical-history'
import PatientDetailCardd from '../Dashboard/PatientDetailCardd'
import DateCalendarServerRequest from '../Dashboard/DateCalendarServerRequest'
import { Box, Card } from '@mui/material'
import MedicalCheckup from '../Dashboard/MedicalCheckup';
import PatientContext from '../../../contexts/patient-context'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { Patient } from '@healthcare/data-transfer-types'
import { environment } from '../../../../environments/environment';

const Dashboard: React.FC = () => {

  const params=useParams();
  const [patient, setPatient]=useState<Patient | null>(null);
  const apiUrl = environment.apiUrl;

  const patientcontext=useContext(PatientContext);

  const getPatient=async()=>{
    const response = await axios.get(`${apiUrl}/hospitals/${params.hospitalId}/patients/${params.patientId}`,
      {
        withCredentials:true
      }
    );

    setPatient(response.data[0]);
    console.log("Patient history:", response.data);
  }

  useEffect(()=>{
    getPatient();
    patientcontext?.setPatient(patient);
  },[apiUrl,params])
 
  
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '100%',
          alignItems: 'center',
          border: '1px solid #ccc',
          margin: '0%',
        }}
      >
        <Box sx={{marginTop:'2%',width:'100%',display:'flex',flexDirection:'row',justifyContent: 'space-between'}}>

        <Card sx={{ width: '65%',marginLeft: '2%',}}>
          <div style={{width:'80%' ,padding:'3% 0 3% 6%',color:'#064B4F',fontWeight:"bold",fontSize:'20px',
            display:"flex", justifyContent:"space-between", alignItems:"center",
          }}>
            BASIC INFORMATION
            
            <Link to={`/hospitals/${params.hospitalId}/patients/${patientcontext?.patient?.id}/appointments`} color="#064B4F" style={{position: 'relative',
              right: '-64px',
              marginTop:' -22px',
              float: 'right'
            }}>
          view all
        </Link>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems:'flex-start',
              marginLeft: '2%',
              width:'100%'
            }}
            >
          <PatientDetailCardd patientId={patientcontext?.patient?.id}/>
          <MedicalCheckup />
          </div>
        </Card>

        <DateCalendarServerRequest />
            </Box>

        <Box sx={{ width: '100%',
           marginTop: 3 ,
           padding: 2,
          }}>
          <MedicalHistory patientId={params.patientId}/>
        </Box>
      </Box>
    </div>
  )
}

export default Dashboard
