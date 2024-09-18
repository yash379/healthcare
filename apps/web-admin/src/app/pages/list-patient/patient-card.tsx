import React from 'react';
import { Card, CardContent, Avatar, Typography, Button, Box, Stack, Divider } from '@mui/material';
import { CheckCircleOutline, CancelOutlined } from '@mui/icons-material';
import Chip from '../../Components/chip/chip';
import { stringAvatar } from '../../utils/user';
import { Gender } from '@prisma/client';

interface PatientCardProps {
  firstName: string;
  lastName: string;
  address: string;
  digitalHealthCode:string;
  dob: string;
  age: number;
  bloodGroup: string;
  gender: Gender;
  status:boolean;
  onClick: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({
  firstName,
  lastName,
  address,
  digitalHealthCode,
  dob,
  bloodGroup,
  age,
  gender,
  status,
  onClick,
}) => {
  return (
<Card sx={{ width: 250, m: 2, height: 300, display: 'flex', flexDirection: 'column', position: 'relative'}}>
<CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Avatar
          style={{marginBottom:'10px'}}
                          {...stringAvatar(
                            `${firstName} ${lastName}`,
                            'medium'
                          )}
                        />
          {!status ? (
                         <Chip label="Error"  sx={{ position: 'absolute', top: 8, right: 8 }}>Inactive</Chip>
                        ) : (
                          
                          <Chip label="Success"  sx={{ position: 'absolute', top: 8, right: 8 }}>Active</Chip>
                       )}
        </Stack>
        <Typography variant="h6">{firstName} {lastName}</Typography>
        <Typography variant="body2" color="textSecondary">
          {address}
        </Typography>
        <Divider sx={{mt:1}} />
        <Box display="flex" flexDirection="row" justifyContent='center'>
        <Box mt={2} display="flex" flexDirection="column" justifyContent='center' gap={1}>
          <Typography variant="body2">
            Digital Health Code: {digitalHealthCode}
            </Typography>
          {/* <Typography variant="body2">Date of birth: {dob}</Typography>  */}
          <Typography variant="body2">Age: {age}</Typography>
          <Typography variant="body2">Gender: {gender}</Typography>
          <Typography variant="body2">Blood Group: {bloodGroup}</Typography>
        </Box>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
  
  <Button
    variant="contained"
    color="primary"
    sx={{ width: '100%', height:'42px' }}
    onClick={onClick}
  >
    View Detailed Patient
  </Button>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
