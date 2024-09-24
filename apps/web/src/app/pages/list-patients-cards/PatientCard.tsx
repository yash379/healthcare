import React, { useContext } from 'react';
import { Avatar, Button, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ViewPatient } from '@healthcare/data-transfer-types';
import HospitalContext from '../../contexts/hospital-context';
import DoctorContext from '../../contexts/doctor-context';
import { useNavigate, useParams } from 'react-router-dom';

interface PatientCardProps {
//   name: string;
//   address: string;
//   weight: number;
//   height: number;
//   bloodgroup: string;
//   profilePicture: string;
  patient:ViewPatient;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({
//   name,
//   address,
//   weight,
//   height,
//   bloodgroup,
//   profilePicture,
  patient,
  onEdit,
  onDelete,
  onViewDetails
}) => {

    const hospitalcontext=useContext(HospitalContext);
    const doctorcontext=useContext(DoctorContext);
    const params=useParams;
    const navigate=useNavigate();

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      padding: '16px',
      width: '250px',
      boxShadow: '0 3.72px 3.72px 0px rgba(0, 0, 0, 0.25)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      backgroundColor: '#ffffff',
      margin: '10px',
      height: '338px',
      opacity: '0px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {/* <img src={profilePicture} alt="Patient" style={{ borderRadius: '41.71px', marginBottom: '8px', width: '56.68px', height: '56.68px', objectFit: 'cover',marginLeft:'12px' }} /> */}
           <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: 24,
                  bgcolor: '#064B4F',
                  marginTop: '10px',
                }}
              >
              {patient?.firstName.split(' ').map((name) => name[0]).join('')}
              </Avatar>
        <div>
          <IconButton size="small" style={{ padding: '0', color: 'rgba(50,50,50,1)', width: '15px', height: '15px',marginRight:'15px' }} onClick={onEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" style={{ padding: '0', color: 'rgba(203,1,1,1)', width: '15px', height: '15px', }} onClick={onDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
      <h3 style={{ margin: '8px 0 4px', fontSize: '18px', color: 'rgba(6,75,79,1)', width: '135px', height: '36px', fontFamily: 'Dm Sans', letterSpacing: '-2px',marginLeft:'5px'}}>{patient.firstName}{patient.lastName}</h3>
      <Typography sx={{color:'#064B4F8C'}}>
        {patient.city},{patient.stateCode}-{patient.postalCode}
      </Typography>
      <hr style={{ width: '100%', border: '1px solid #e0e0e0', margin: '8px 0' }} /> {/* Line separator */}
      <Typography >
        Contact: 
        <strong style={{color:'rgba(6,75,79,1)'}}>
            {patient.phoneNumber}
        </strong>
      </Typography>
      <Typography>
        Age:<strong  style={{color:'rgba(6,75,79,1)'}}>
        {patient.age}</strong>
      </Typography>
      <Typography >
         Blood Group:<strong  style={{color:'rgba(6,75,79,1)'}}>
        {patient.bloodGroup}</strong>
      </Typography>
      <Button
        style={{
          backgroundColor: 'rgba(6, 75, 79, 1)',
          borderRadius: '7.43px',
          padding: '8px 12px',
          cursor: 'pointer',
          width: '250.07px',
          height: '57.61px',
          marginTop:'15px',
          color:'white'
        }}
        onClick={()=>navigate(`/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patients/${patient.id}/patient-detail`)}
      >
         View Detailed Patient
      </Button>
    </div>
  );
};

export default PatientCard;