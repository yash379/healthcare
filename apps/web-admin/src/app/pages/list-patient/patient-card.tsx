import React, { useContext } from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Box,
  Stack,
  Divider,
  Grid,
} from '@mui/material';
import { CheckCircleOutline, CancelOutlined } from '@mui/icons-material';
import Chip from '../../Components/chip/chip';
import { stringAvatar } from '../../utils/user';
import { Gender } from '@prisma/client';
import { useNavigate, useParams } from 'react-router-dom';
import { HospitalContext } from '../../contexts/user-contexts';

interface PatientCardProps {
  patientId:number;
  firstName: string;
  lastName: string;
  address: string;
  digitalHealthCode: string;
  dob: string;
  age: number;
  bloodGroup: string;
  gender: Gender;
  status: boolean;

  // onClick: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({
  patientId,
  firstName,
  lastName,
  address,
  digitalHealthCode,
  dob,
  bloodGroup,
  age,
  gender,
  status,
  // onClick,
}) => {

  const params = useParams();
  const hospitalContext = useContext(HospitalContext);
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        width: 250,
        m: 2,
        height: 315,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <CardContent
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Avatar
            style={{ marginBottom: '10px' }}
            {...stringAvatar(`${firstName} ${lastName}`, 'medium')}
          />
          {!status ? (
            <Chip label="Error" sx={{ position: 'absolute', top: 8, right: 8 }}>
              Inactive
            </Chip>
          ) : (
            <Chip
              label="Success"
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              Active
            </Chip>
          )}
        </Stack>
        <Typography variant="h6">
          {firstName} {lastName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {address}
        </Typography>
        <Divider sx={{ mt: 1 }} />
        <Box display="flex" flexDirection="row" justifyContent="center" m="10px" ml="25px">
            <Grid container spacing={1} display='flex' flexDirection='row'  justifyContent="center" >
              <Grid item xs={6}>
                <Typography variant="body2">Digital Health Code:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{digitalHealthCode}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2">Age:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{age}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2">Gender:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{gender}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2">Blood Group:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{bloodGroup}</Typography>
              </Grid>
            </Grid>
        </Box>
        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          color="primary"
          sx={{ width: '100%', height: '42px' }}
          onClick={() => navigate(`/hospitals/${hospitalContext?.id}/doctors/${params.doctorId}/patients/${patientId}/patient-detail`)}
        >
          View Detailed Patient
        </Button>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
