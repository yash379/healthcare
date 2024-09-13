// import React, { useState } from 'react';
// import styles from '../MedicalHistory/MedicalHistory.scss';
// import {
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   Divider,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Paper,
//   Box,
//   Tooltip,
// } from '@mui/material';
// import PrintIcon from '@mui/icons-material/Print';
// import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
// // import Summarizer from '../ai-summarizer/ai-summarizer';

// /* eslint-disable-next-line */
// export interface MedicalHistoryProps {}

// const dummyMedicalHistory = {
//   patientName: 'Omkar Patil',
//   history: [
//     {
//       date: '08/22/2023',
//       vitals: {
//         height: 175,
//         weight: 72,
//         pulse: 78,
//         spo2: 98,
//         bmi: 23.5,
//         temperature: 36.7,
//       },
//       diagnosis: 'Flu and common cold',
//       prescriptions: [
//         {
//           medicineName: 'Paracetamol',
//           dose: '500mg',
//           instructions: 'After meals',
//           frequency: '1-1-1',
//           duration: '5 days',
//         },
//         {
//           medicineName: 'Cough Syrup',
//           dose: '10ml',
//           instructions: 'Before bed',
//           frequency: '0-0-1',
//           duration: '5 days',
//         },
//       ],
//     },
//     {
//       date: '07/15/2023',
//       vitals: {
//         height: 175,
//         weight: 70,
//         pulse: 80,
//         spo2: 97,
//         bmi: 22.9,
//         temperature: 37.0,
//       },
//       diagnosis: 'Mild Gastritis',
//       prescriptions: [
//         {
//           medicineName: 'Antacid',
//           dose: '1 tablet',
//           instructions: 'Before meals',
//           frequency: '1-0-1',
//           duration: '7 days',
//         },
//       ],
//     },
//   ],
// };

// export function MedicalHistory(props: MedicalHistoryProps) {
//   const [showSummary, setShowSummary] = useState(false);

//   if (showSummary) {
//     // return <Summarizer />;
//   }

//   return (
//     <div className={styles['container']}>
//       <Grid container alignItems="center" justifyContent="space-between">
//         <Grid item>
//           <Typography variant="h4" gutterBottom>
//             {dummyMedicalHistory.patientName}'s Medical History
//           </Typography>
//         </Grid>
//         <Grid item>
//           <Tooltip title="Generate Summary">
//             <IconButton
//               onClick={() => setShowSummary(true)}
//               aria-label="ai-summarizer"
//             >
//               <AutoAwesomeOutlinedIcon sx={{ marginRight: 6 }} />
//             </IconButton>
//           </Tooltip>
//         </Grid>
//       </Grid>

//       {dummyMedicalHistory.history.map((entry, index) => (
//         <Card key={index} sx={{ marginBottom: 4 }}>
//           <CardContent>
//             <Box
//               sx={{ backgroundColor: '#e0f2f1', padding: 2, borderRadius: 1 }}
//             >
//               <Grid
//                 container
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <Typography variant="h6">Date: {entry.date}</Typography>
//                 <div>
//                   <IconButton
//                     sx={{ marginRight: 2 }}
//                     onClick={() => window.print()}
//                     aria-label="print"
//                   >
//                     <PrintIcon />
//                   </IconButton>
//                 </div>
//               </Grid>
//             </Box>
//             <Divider sx={{ marginBottom: 2 }} />

//             <Typography variant="subtitle1">Vitals:</Typography>
//             <Typography variant="body1" sx={{ marginBottom: 2 }}>
//               Height: {entry.vitals.height} cm, Weight: {entry.vitals.weight}{' '}
//               kg, Pulse: {entry.vitals.pulse} bpm, SPO2: {entry.vitals.spo2} %,
//               BMI: {entry.vitals.bmi}, Temperature: {entry.vitals.temperature}{' '}
//               °C
//             </Typography>

//             <Divider sx={{ marginY: 2 }} />

//             <Typography
//               variant="subtitle1"
//               sx={{
//                 backgroundColor: '#ffe6e6', // Light red background
//                 padding: '8px',
//                 borderRadius: '4px',
//                 display: 'inline', // Keeps the diagnosis on the same line
//               }}
//             >
//               Diagnosis:
//             </Typography>
//             <Typography
//               variant="body1"
//               sx={{ display: 'inline', marginLeft: '4px' }}
//             >
//               {entry.diagnosis}
//             </Typography>

//             <Divider sx={{ marginY: 2 }} />

//             <Typography variant="subtitle1">Prescriptions</Typography>
//             <TableContainer component={Paper}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Medicine Name</TableCell>
//                     <TableCell>Dose</TableCell>
//                     <TableCell>Instructions</TableCell>
//                     <TableCell>Frequency</TableCell>
//                     <TableCell>Duration</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {entry.prescriptions.map((prescription, idx) => (
//                     <TableRow key={idx}>
//                       <TableCell>{prescription.medicineName}</TableCell>
//                       <TableCell>{prescription.dose}</TableCell>
//                       <TableCell>{prescription.instructions}</TableCell>
//                       <TableCell>{prescription.frequency}</TableCell>
//                       <TableCell>{prescription.duration}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }

// export default MedicalHistory;


// JHAPUK JHUPUK CODING
import React, { useState } from 'react';
// import styles from './MedicalHistory.module.scss';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Box,
  Tooltip,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
// import Summarizer from '../ai-summarizer/ai-summarizer';

/* eslint-disable-next-line */
export interface MedicalHistoryProps {}

const dummyMedicalHistory = {
  patientName: 'Omkar Khadke',
  history: [
    {
      date: '08/22/2023',
      vitals: {
        height: 175,
        weight: 72,
        pulse: 78,
        spo2: 98,
        bmi: 23.5,
        temperature: 36.7,
      },
      diagnosis: 'Flu and common cold',
      prescriptions: [
        {
          medicineName: 'Paracetamol',
          dose: '500mg',
          instructions: 'After meals',
          frequency: '1-1-1',
          duration: '5 days',
        },
        {
          medicineName: 'Cough Syrup',
          dose: '10ml',
          instructions: 'Before bed',
          frequency: '0-0-1',
          duration: '5 days',
        },
      ],
    },
    {
      date: '07/15/2023',
      vitals: {
        height: 175,
        weight: 70,
        pulse: 80,
        spo2: 97,
        bmi: 22.9,
        temperature: 37.0,
      },
      diagnosis: 'Mild Gastritis',
      prescriptions: [
        {
          medicineName: 'Antacid',
          dose: '1 tablet',
          instructions: 'Before meals',
          frequency: '1-0-1',
          duration: '7 days',
        },
      ],
    },
  ],
};

export function MedicalHistory(props: MedicalHistoryProps) {
  const [showSummary, setShowSummary] = useState(false);

  if (showSummary) {
    // return <Summarizer />;
  }

  return (
    <div style={{ 
      // padding: 16 ,
      // border: '1px solid #ccc' ,
      // borderTop: '1px solid white',
      // boxShadow: '0px 2px #ccc',
      // backgroundColor: '#000000',
      // paddingTop: '20px',
      padding: '20px',
      marginTop: '20px',
      border: '1px solid #ccc',
      borderTop: '0px solid white',
    }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h4" gutterBottom sx={{color:'#064B4F'}}>
             Medical History
          </Typography>
        </Grid>
        <Grid item>
          <Tooltip title="Generate Summary">
            <IconButton
              onClick={() => setShowSummary(true)}
              aria-label="ai-summarizer"
            >
              <AutoAwesomeOutlinedIcon sx={{ marginRight: 6 }} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      {dummyMedicalHistory.history.map((entry, index) => (
        <Card key={index} sx={{ marginBottom: 4 ,}}>
          <CardContent sx={{
            padding: 0
          }}>
            <Box
              sx={{ 
                backgroundColor: '#139C94',
                padding: 1,
                // borderRadius: 1,  
                display: 'flex',
                justifyContent: 'space-between',  
                
               }}
            >
              
                <Typography variant="h6" sx={{
                  color: 'white', 
                  fontWeight:'bold',
                }}>Date : {entry.date}</Typography>
                <div>
                  <IconButton
                    sx={{ marginRight: 2 , color:'white'}}
                    onClick={() => window.print()}
                    aria-label="print"
                    
                  >
                    <PrintIcon />
                  </IconButton>
                </div>
           
            </Box>
            <Divider sx={{ marginBottom: 2 }} />
               <Box
               sx={{
                padding: 2
               }}
               >
            <Typography variant="subtitle1" >Vitals:</Typography>
            <Typography variant="body1" sx={{ marginBottom: 2}}>
              Height: {entry.vitals.height} cm, Weight: {entry.vitals.weight}{' '}
              kg, Pulse: {entry.vitals.pulse} bpm, SPO2: {entry.vitals.spo2} %,
              BMI: {entry.vitals.bmi}, Temperature: {entry.vitals.temperature}{' '}
              °C
            </Typography>

            <Divider sx={{ marginY: 2 }} />

            <Typography
              variant="subtitle1"
              sx={{
                backgroundColor: '#ffe6e6', // Light red background
                padding: '8px',
                borderRadius: '4px',
                display: 'inline', // Keeps the diagnosis on the same line
              }}
            >
              Diagnosis:
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: 'inline', marginLeft: '4px' }}
            >
              {entry.diagnosis}
            </Typography>

            <Divider sx={{ marginY: 2 }} />

            <Typography variant="subtitle1">Prescriptions</Typography>
            <TableContainer component={Paper} sx={{border:'1px solid #ccc'}}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Medicine Name</TableCell>
                    <TableCell>Dose</TableCell>
                    <TableCell>Instructions</TableCell>
                    <TableCell>Frequency</TableCell>
                    <TableCell>Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entry.prescriptions.map((prescription, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{prescription.medicineName}</TableCell>
                      <TableCell>{prescription.dose}</TableCell>
                      <TableCell>{prescription.instructions}</TableCell>
                      <TableCell>{prescription.frequency}</TableCell>
                      <TableCell>{prescription.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
            </TableContainer>
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default MedicalHistory;