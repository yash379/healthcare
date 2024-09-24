import React, { useContext, useState } from 'react';
import { Avatar, Box, Button, IconButton, Menu, MenuItem, Typography, ListItemIcon } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ViewPatient } from '@healthcare/data-transfer-types';
import HospitalContext from '../../contexts/hospital-context';
import DoctorContext from '../../contexts/doctor-context';
import { useNavigate, useParams } from 'react-router-dom';

interface PatientCardProps {
  patient: ViewPatient;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const hospitalcontext = useContext(HospitalContext);
  const doctorcontext = useContext(DoctorContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Handle opening the MoreVertIcon menu
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing the MoreVertIcon menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Navigate to edit the patient
  const handleEdit = () => {
    navigate(
      `/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patients/${patient.id}/edit`
    );
    handleClose();
  };
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
        height: '315px',
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
            aria-controls={open ? 'action-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>

          <Menu
            id="action-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'action-menu-button',
            }}
          >
            {/* Edit Option */}
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <Typography variant="inherit">Edit</Typography>
            </MenuItem>

            {/* Delete Option */}
            <MenuItem onClick={onDelete}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <Typography variant="inherit">Delete</Typography>
            </MenuItem>
          </Menu>
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
          Digital Health Code :
          <strong
            style={{
              color: 'rgba(6,75,79,1)',
              fontSize: '16px',
              marginBottom: '5px',
            }}
          >
            {patient.digitalHealthCode}
          </strong>
        </Typography>
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
        <Typography
          style={{
            fontSize: '16px',
            marginBottom: '5px',
          }}
        >
          Gender :
          <strong
            style={{
              color: 'rgba(6,75,79,1)',
              fontSize: '16px',
              marginBottom: '5px',
            }}
          >
            {patient.gender}
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
