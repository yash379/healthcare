import React from 'react';
import { Card, CardContent, Avatar, Typography, Button, Box, Stack, Divider } from '@mui/material';
import { CheckCircleOutline, CancelOutlined } from '@mui/icons-material';
import Chip from '../../Components/chip/chip';
import { stringAvatar } from '../../utils/user';

interface PatientCardProps {
  firstName: string;
  lastName: string;
  address: string;
  weight: string;
  height: string;
  bloodGroup: string;
  status: 'Active' | 'Inactive';
  onClick: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({
  firstName,
  lastName,
  address,
  weight,
  height,
  bloodGroup,
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
          {status === 'Active' ? (
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
          <Typography variant="body2">Weight: {firstName}</Typography>
          <Typography variant="body2">Height: {lastName}</Typography>
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
