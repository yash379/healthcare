import React, { useContext } from 'react'
import MedicalHistory from '../medical-history/medical-history'
import PatientDetailCardd from '../Dashboard/PatientDetailCardd'
import DateCalendarServerRequest from '../Dashboard/DateCalendarServerRequest'
import { Box, Card, Link } from '@mui/material'
import MedicalCheckup from '../Dashboard/MedicalCheckup';
import PatientContext from '../../../contexts/patient-context'
import { useParams } from 'react-router-dom'

const Dashboard: React.FC = () => {

  const params=useParams();

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
            
            <Link href="#" underline="none" color="#064B4F" fontSize="0.875rem" 
        sx={{
          textDecoration: "underline",
        }}
        >
          view all
        </Link>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: '2%',
            }}
            >
          <PatientDetailCardd patientId={params.patientId}/>
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
