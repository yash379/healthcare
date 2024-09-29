import styles from './medical-history.module.scss';
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
import Summarizer from '../ai-summarizer/ai-summarizer';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { ViewPatient } from '@healthcare/data-transfer-types';
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface Medicine {
  medicineName: string;
  dose: string;
  instructions: string;
  frequency: string;
  duration: string;
}

interface DiagnosisDetails {
  height: number;
  weight: number;
  pulse: number;
  details: string;
  chiefComplaints: string[];
}

interface Prescription {
  medicines: Medicine[];
}

interface GroupedData {
  diagnosisDate: string;
  diagnosisDetails: DiagnosisDetails;
  relatedPrescriptions: Prescription[];
}

interface MedicalHistory {
  patientName: string;
  groupedData: GroupedData[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MedicalHistoryProps {}

export function MedicalHistory(props: MedicalHistoryProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<ViewPatient | null>(null);
  const [printData, setPrintData] = useState<GroupedData | null>(null);
  const params = useParams();
  const apiUrl = environment.apiUrl;

  const getAllMedicalHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/medical-history/${params.patientId}`,
        { withCredentials: true }
      );
      setMedicalHistory(response.data);
      console.log('Medical history Data', response.data);
    } catch (error) {
      console.error('Error fetching medical history data:', error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, params.patientId]);

  const getPatient = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/hospitals/${params.hospitalId}/patients/${params.patientId}`,
        { withCredentials: true }
      );
      const patient = response.data?.[0] || null;
      setPatientData(patient);
      console.log('Patient Data', response.data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, params.hospitalId, params.patientId]);

  useEffect(() => {
    getAllMedicalHistory();
  }, [getAllMedicalHistory]);

  useEffect(() => {
    getPatient();
  }, [getPatient]);

 
  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MM/dd/yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // // Function to send data to ML model
  // const sendToMLModel = async (data: MedicalHistory) => {
  //   try {
  //     const response = await axios.post(
  //       `${apiUrl}/chat-request/chat`,
  //       { text: generateMedicalHistorySummary(data) },
  //       { withCredentials: true }
  //     );
  //     console.log('Response from ML model:', response.data);
  //     setShowSummary(true);
  //   } catch (error) {
  //     console.error('Error sending data to ML model:', error);
  //   }
  // };

  // // Function to generate summary from medical history data
  // const generateMedicalHistorySummary = (data: MedicalHistory) => {
  //   let summary = `Patient Medical History Summary:\n\n`;

  //   data.groupedData.forEach((entry, index) => {
  //     summary += `Diagnosis ${index + 1}:\n`;
  //     summary += `Diagnosis Date: ${formatDate(entry.diagnosisDate)}\n`;
  //     summary += `Details: ${entry.diagnosisDetails.details}\n`;
  //     summary += `Height: ${entry.diagnosisDetails.height} cm, Weight: ${entry.diagnosisDetails.weight} kg\n`;
  //     summary += `Pulse: ${entry.diagnosisDetails.pulse} bpm\n`;
  //     summary += `Chief Complaints: ${entry.diagnosisDetails.chiefComplaints.join(', ')}\n\n`;

  //     entry.relatedPrescriptions.forEach((prescription, prescriptionIndex) => {
  //       summary += `Prescription ${prescriptionIndex + 1}:\n`;
  //       prescription.medicines.forEach((medicine, medicineIndex) => {
  //         summary += `  Medicine ${medicineIndex + 1}: ${medicine.medicineName}\n`;
  //         summary += `    Dose: ${medicine.dose}, Instructions: ${medicine.instructions}\n`;
  //         summary += `    Frequency: ${medicine.frequency}, Duration: ${medicine.duration}\n`;
  //       });
  //       summary += '\n';
  //     });
  //   });

  //   return summary;
  // };

  // // Handle button click
  // const handleSummarizeClick = () => {
  //   if (medicalHistory) {
  //     sendToMLModel(medicalHistory);
  //   } else {
  //     console.error('No medical history data available.');
  //   }
  // };
  
  function convertResponseToSummary(response: any) {
    // Ensure the response is a string
    const responseText = typeof response === "string" ? response : JSON.stringify(response);
  
    // Extract relevant information using regex or string manipulation
  
    // Extract the latest diagnosis date
    const diagnosisMatches = responseText.match(/Diagnosis 1:\n\n\*\*Diagnosis Date:\*\* (.*)/);
    const latestDiagnosis = diagnosisMatches ? diagnosisMatches[1] : "N/A";
  
    // Extract the treatment plan
    const treatmentPlanMatches = responseText.match(/Treatment Plan:\n\n([\s\S]*?)(?=\n\n\*\*Follow-up:)/);
    const treatmentPlan = treatmentPlanMatches ? treatmentPlanMatches[1].trim() : "N/A";
  
    // Extract major issues (Chief Complaints)
    const majorIssuesMatches = responseText.match(/Chief Complaints:\*\*(.*?)(?=\n\n)/);
    const majorIssues = majorIssuesMatches ? majorIssuesMatches[1].trim() : "N/A";
  
    // Return the parsed summary object
    return {
      latestDiagnosis,
      treatmentPlan,
      majorIssues
    };
  }

  // Function to send data to ML model
const sendToMLModel = async (data: MedicalHistory) => {
  try {
    const response = await axios.post(
      `${apiUrl}/chat-request/chat`,
      { text: generateMedicalHistorySummary(data) },
      { withCredentials: true }
    );
    
    console.log('Response from ML model:', response.data);
    const summaryData = convertResponseToSummary(response.data);
    console.log('summary data convertned', summaryData)
    setShowSummary(true);
  } catch (error) {
    console.error('Error sending data to ML model:', error);
  }
};

const generateMedicalHistorySummary = (data: MedicalHistory) => {
  let summary = `Patient Medical History Summary:\n\n`;

  summary += `Patient Name: ${data.patientName}\n`;
  summary += `Age: ${patientData?.age || 'N/A'}, Gender: ${patientData?.gender || 'N/A'}, Date of Birth: ${formatDate(patientData?.dob)}\n\n`;

  data.groupedData.forEach((entry, index) => {
    summary += `Diagnosis ${index + 1}:\n`;
    summary += `Diagnosis Date: ${formatDate(entry.diagnosisDate)}\n`;
    summary += `Details: ${entry.diagnosisDetails.details}\n`;
    summary += `Height: ${entry.diagnosisDetails.height} cm, Weight: ${entry.diagnosisDetails.weight} kg\n`;
    summary += `Pulse: ${entry.diagnosisDetails.pulse} bpm\n`;
    summary += `Chief Complaints: ${entry.diagnosisDetails.chiefComplaints.join(', ')}\n\n`;

    entry.relatedPrescriptions.forEach((prescription, prescriptionIndex) => {
      summary += `Prescription ${prescriptionIndex + 1}:\n`;
      prescription.medicines.forEach((medicine, medicineIndex) => {
        summary += `  Medicine ${medicineIndex + 1}: ${medicine.medicineName}\n`;
        summary += `    Dose: ${medicine.dose}\n`;
        summary += `    Frequency: ${medicine.frequency}\n`;
        summary += `    Duration: ${medicine.duration}\n`;
        summary += `    Instructions: ${medicine.instructions}\n\n`;
      });
    });

    // Add placeholders for treatment plan and follow-up if applicable
    summary += `Treatment Plan: [Add treatment plan details here]\n`;
    summary += `Follow-up: [Add follow-up date or recommendations here]\n\n`;
  });

  summary += `Social History: [Lifestyle details if available]\n`;
  summary += `Family History: [Any relevant family history]\n`;

  return summary;
};


// Handle button click
const handleSummarizeClick = () => {
  if (medicalHistory) {
    sendToMLModel(medicalHistory);
  } else {
    console.error('No medical history data available.');
  }
};






//  useEffect(() => {
//   // const handlePrint = () => {
//     if (printData) {
//       // Create an iframe element
//       const printFrame = document.createElement('iframe');
//       printFrame.style.position = 'absolute';
//       printFrame.style.width = '0px';
//       printFrame.style.height = '0px';
//       printFrame.style.border = 'none';
//       document.body.appendChild(printFrame);
  
//       // Open iframe document
//       const printDoc = printFrame?.contentWindow?.document;
//       printDoc?.open();
//       printDoc?.write(`
//         <html>
//           <head>
//             <title>Print Diagnosis</title>
//             <style>
//               body { font-family: Arial, sans-serif; margin: 20px; }
//               h1 { font-size: 24px; border-bottom: 2px solid #000; padding-bottom: 10px; }
//               h2 { font-size: 20px; margin-top: 20px; }
//               p { font-size: 16px; line-height: 1.6; }
//               table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//               th, td { border: 1px solid #000; padding: 8px; text-align: left; }
//               th { background-color: #f2f2f2; }
//               tr:nth-child(even) { background-color: #f9f9f9; }
//             </style>
//           </head>
//           <body>
//             <h1>Medical History</h1>
//             <h2>Date: ${formatDate(printData.diagnosisDate)}</h2>
//             <p><strong>Vitals:</strong> Height: ${printData.diagnosisDetails.height} cm, Weight: ${printData.diagnosisDetails.weight} kg, Pulse: ${printData.diagnosisDetails.pulse} bpm</p>
//             <p><strong>Details:</strong> ${printData.diagnosisDetails.details}</p>
//             <p><strong>Chief Complaints:</strong> ${printData.diagnosisDetails.chiefComplaints.join(', ')}</p>
//             <h3>Prescriptions</h3>
//             <table>
//               <tr><th>Medicine Name</th><th>Dose</th><th>Instructions</th><th>Frequency</th><th>Duration</th></tr>
//               ${printData.relatedPrescriptions.map(prescription =>
//                 prescription.medicines.map(medicine =>
//                   `<tr>
//                     <td>${medicine.medicineName}</td>
//                     <td>${medicine.dose}</td>
//                     <td>${medicine.instructions}</td>
//                     <td>${medicine.frequency}</td>
//                     <td>${medicine.duration}</td>
//                   </tr>`
//                 ).join('')
//               ).join('')}
//             </table>
//           </body>
//         </html>
//       `);
//       printDoc?.close();
  
//       // Delay the print dialog
//       setTimeout(() => {
//         printFrame?.contentWindow?.focus();
//         printFrame?.contentWindow?.print();
  
//         // Remove the iframe from the document after printing
//         document.body.removeChild(printFrame);
//       }, 500); // Adjust the delay as needed
//     }
//   }, [printData]);

useEffect(() => {
  if (printData && patientData) {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add Patient Information
    doc.setFontSize(18);
    doc.setFont('Arial', 'bold');
    doc.text('Medical History', 14, 22);
    
    doc.setFontSize(14);
    doc.setFont('Arial', 'normal');
    doc.text('Patient Information', 14, 40);
    
    doc.setFontSize(12);
    doc.text(`Name: ${patientData.firstName || 'N/A'} ${patientData.lastName || 'N/A'}`, 14, 50);
    doc.text(`Date of Birth: ${formatDate(patientData.dob) || 'N/A'}`, 14, 60);
    doc.text(`Gender: ${patientData.gender || 'N/A'}`, 14, 70);

    // Add Diagnosis Details
    doc.setFontSize(14);
    doc.setFont('Arial', 'bold');
    doc.text('Diagnosis Details', 14, 90);
    
    doc.setFontSize(12);
    doc.setFont('Arial', 'normal');
    doc.text(`Date: ${formatDate(printData.diagnosisDate)}`, 14, 105);
    doc.text(`Vitals: Height: ${printData.diagnosisDetails.height} cm, Weight: ${printData.diagnosisDetails.weight} kg, Pulse: ${printData.diagnosisDetails.pulse} bpm`, 14, 115);
    doc.text(`Details: ${printData.diagnosisDetails.details}`, 14, 125);
    doc.text(`Chief Complaints: ${printData.diagnosisDetails.chiefComplaints.join(', ')}`, 14, 135);

    // Add Prescriptions Table
    doc.setFontSize(14);
    doc.setFont('Arial', 'bold');
    doc.text('Prescriptions', 14, 155);

    // Prepare table data
    const tableData = [
      ['Medicine Name', 'Dose', 'Instructions', 'Frequency', 'Duration'],
      ...printData.relatedPrescriptions.flatMap(prescription =>
        prescription.medicines.map(medicine => [
          medicine.medicineName,
          medicine.dose,
          medicine.instructions,
          medicine.frequency,
          medicine.duration
        ])
      )
    ];

    // Add table to PDF with styling
    doc.autoTable({
      startY: 165,
      head: tableData.slice(0, 1),
      body: tableData.slice(1),
      // theme: 'grid',
      // headStyles: { fillColor: "#4FD1C5", textColor: [255, 255, 255], fontSize: 12 },
      // bodyStyles: { fontSize: 10 },
      // margin: { top: 10 },
      // styles: { cellPadding: 4 },
    });

    // Save the PDF
    doc.save('medical-history.pdf');
    setPrintData(null);
  }
}, [printData, patientData]);

  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (showSummary) {
    return <Summarizer />;
  }

  if (!medicalHistory || !medicalHistory.groupedData) {
    return <div>No medical history data available.</div>;
  }


  return (
    <div className={styles['container']}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h4" gutterBottom>
            {patientData?.firstName} {patientData?.lastName}'s Medical History
          </Typography>
        </Grid>
        <Grid item>
          {/* <Tooltip title="Generate Summary">
            <IconButton
              onClick={handleSummarizeClick}
              aria-label="ai-summarizer"
            >
              <AutoAwesomeOutlinedIcon sx={{ marginRight: 6 }} />
            </IconButton>
          </Tooltip> */}
        </Grid>
      </Grid>

      {/* Render the medical history data */}
      {medicalHistory.groupedData.map((entry: GroupedData, index: number) => (
        <Card key={index} sx={{ marginBottom: 4 }}>
          <CardContent>
            <Box
              sx={{ backgroundColor: '#e0f2f1', padding: 2, borderRadius: 1 }}
            >
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  Date: {formatDate(entry.diagnosisDate)}
                </Typography>
                <div>
                <IconButton
                    sx={{ marginRight: 2 }}
                    onClick={() => {
                      setPrintData(entry);
                      // handlePrint();
                    }}
                    aria-label="print"
                  >
                    <PrintIcon />
                  </IconButton>
                </div>
              </Grid>
            </Box>
            <Divider sx={{ marginBottom: 2 }} />

            <Typography variant="subtitle1" sx={{
                padding: '8px',
                borderRadius: '4px',
                display: 'inline',
                backgroundColor: '#e0f7fa',
              }}>Vitals:</Typography>
            <Typography variant="body1" sx={{ display: 'inline', marginLeft: '4px' }}>
              Height: {entry.diagnosisDetails.height} cm, Weight:{' '}
              {entry.diagnosisDetails.weight} kg, Pulse:{' '}
              {entry.diagnosisDetails.pulse} bpm
            </Typography>

            <Divider sx={{ marginY: 2 }} />

            <Typography variant="subtitle1"  sx={{
                backgroundColor: '#ffe6e6',
                padding: '8px',
                borderRadius: '4px',
                display: 'inline',
              }}>Diagnosis:</Typography>
            <Typography variant="body1" sx={{ padding: '8px', marginLeft: '4px'}}>
             <Typography variant="body1"  sx={{fontWeight:'bold',display: 'inline'}}>Details:</Typography>  {entry.diagnosisDetails.details}
            </Typography>
            <Typography variant="body1" sx={{ padding: '8px', marginLeft: '4px'}}>
            <Typography variant="body1"  sx={{fontWeight:'bold',display: 'inline'}}>Chief Complaints:</Typography> {entry.diagnosisDetails.chiefComplaints.join(', ')}
            </Typography>

            <Divider sx={{ marginY: 2 }} />

            <Typography variant="subtitle1" sx={{backgroundColor: '#fffde7', padding: '8px',
                borderRadius: '4px',
                display: 'inline',}}>Prescriptions</Typography>
            <TableContainer component={Paper} sx={{marginTop: 2}}>
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
                  {entry.relatedPrescriptions.map((prescription: Prescription, idx: number) =>
                    // Loop through medicines inside the prescription
                    prescription.medicines.map((medicine: Medicine, medIdx: number) => (
                      <TableRow key={medIdx}>
                        <TableCell>{medicine.medicineName}</TableCell>
                        <TableCell>{medicine.dose}</TableCell>
                        <TableCell>{medicine.instructions}</TableCell>
                        <TableCell>{medicine.frequency}</TableCell>
                        <TableCell>{medicine.duration}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default MedicalHistory;
