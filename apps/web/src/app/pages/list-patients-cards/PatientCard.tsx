import React, { useContext } from 'react';
import { Avatar, Box, Button, IconButton, Typography } from '@mui/material';
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
  patient: ViewPatient;
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
  onViewDetails,
}) => {
  const hospitalcontext = useContext(HospitalContext);
  const doctorcontext = useContext(DoctorContext);
  const params = useParams;
  const navigate = useNavigate();

  return (
    <div
      style={{
        border: '1px solid #e0e0e0',
        padding: '16px',
        width: '330px',
        boxShadow: '0 3.72px 3.72px 0px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: '#ffffff',
        margin: '10px',
        height: '270px',
        opacity: '0px',
        borderRadius: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'self-start',
          }}
        >
          {/* Avatar with Initials */}
          <Avatar
            sx={{
              width: 50,
              height: 50,
              fontSize: 22,
              bgcolor: '#064B4F',
              marginBottom: '20px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {`${patient?.firstName[0]}${patient?.lastName[0]}`}
          </Avatar>

          {/* Full Name below Avatar */}
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 'bold',
              fontSize: '18px',
              color: 'rgba(6,75,79,1)', // Same color as before
              textAlign: 'center', // Center the name text
            }}
          >
            {`${patient?.firstName} ${patient?.lastName}`}
          </Typography>
        </Box>

        <div>
          <IconButton
            size="small"
            style={{
              padding: '0',
              color: 'rgba(50,50,50,1)',
              width: '15px',
              height: '15px',
              marginRight: '15px',
            }}
            onClick={onEdit}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            style={{
              padding: '0',
              color: 'rgba(203,1,1,1)',
              width: '15px',
              height: '15px',
            }}
            onClick={onDelete}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
      <hr
        style={{ width: '100%', border: '1px solid #e0e0e0', margin: '8px 0' }}
      />{' '}
      {/* Line separator */}
      <Box
        sx={{
          marginTop: '10px',
        }}
      >
        <Typography
          style={{
            fontSize: '16px',
            marginBottom: '5px',
          }}
        >
          Contact :
          <strong
            style={{
              color: 'rgba(6,75,79,1)',
              fontSize: '16px',
              marginBottom: '5px',
            }}
          >
            {patient.phoneNumber}
          </strong>
        </Typography>
        <Typography
          style={{
            fontSize: '16px',
            marginBottom: '5px',
          }}
        >
          Age:
          <strong style={{ color: 'rgba(6,75,79,1)' }}>{patient.age}</strong>
        </Typography>
        <Typography
          style={{
            fontSize: '16px',
            marginBottom: '5px',
          }}
        >
          Blood Group:
          <strong style={{ color: 'rgba(6,75,79,1)' }}>
            {patient.bloodGroup}
          </strong>
        </Typography>
      </Box>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%'

        }}
      >
        <Button
          style={{
            backgroundColor: 'rgba(6, 75, 79, 1)',
            borderRadius: '7.43px',
            padding: '8px 12px',
            cursor: 'pointer',
            marginTop: '15px',
            color: 'white',
          }}
          onClick={() =>
            navigate(
              `/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patients/${patient.id}/patient-detail`
            )
          }
        >
          View Detailed Patient
        </Button>
      </div>
    </div>
  );
};

export default PatientCard;
