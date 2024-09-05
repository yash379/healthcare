import styles from './list-patients.module.scss';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    TablePagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// import '../component/styles.css'; // Import your CSS file
// import AddPatientModal from './AddPatientModal';
// import EditPatientModal from './EditPatientModal';
// import DeleteConfirmationModal from './DeleteConfirmationModal';
// import PaginationComponent from './PaginationComponent';
import { SelectChangeEvent } from '@mui/material';
import { environment } from '../../../../environments/environment';
import axios from 'axios';
import { HospitalContext } from '../../../contexts/user-context';
import AddPatients from '../add-patients/add-patients';
import { enqueueSnackbar } from 'notistack';
import AddPatientComponent from '../../list-patient/add-patient/add-patient';
import { useParams } from 'react-router-dom';
import { Gender, Patient } from '@prisma/client';
import { PatientContext } from '../../../contexts/patient-context';
import DoctorContext from '../../../contexts/doctor-context';

type PatientStatus = 'Active' | 'Inactive';





type Status = 'Active' | 'Inactive';

// Custom component for status display
const StatusBadge = ({ status }: { status: Status }) => {
    const isActive = status === 'Active';

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '5px 10px',
            borderRadius: '20px',
            backgroundColor: isActive ? '#ECFDF3' : '#f8d7da',
            color: isActive ? '#2ecc71' : '#e74c3c',
            fontWeight: 'bold',
            width: '78px',
            height: '22px',
        }}>
            <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: isActive ? '#2ecc71' : '#e74c3c',
                marginRight: '8px',
            }} />
            {status}
        </div>
    );
};

interface Form {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  gender: Gender;
  bloodGroup: string;
  dob: Date;
  digitalHealthCode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  isActive: boolean;
  age:number;
}

export interface ListPatientsProps {}

export function ListPatients(props: ListPatientsProps) {
  const apiUrl = environment.apiUrl;
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQueryName, setSearchQueryName] = useState<string>('');
    const [searchQueryEmail, setSearchQueryEmail] = useState<string>('');
    const [searchQueryPhone, setSearchQueryPhone] = useState<string>('');
    const [totalItems, setTotalItems] = useState(0);

    const hospitalContext = useContext(HospitalContext);
    const patientContext = useContext(PatientContext);
    const doctorContext=useContext(DoctorContext);
    const params = useParams();

    const validationSchema = yup.object().shape({
      name: yup.string().required('Name is required'),
      email: yup.string().email('Invalid email format').required('Email is required'),
      gender: yup.string().oneOf(['Male', 'Female'], 'Invalid gender').required('Gender is required'),
      age: yup.number().required('Age is required').positive('Age must be a positive number').integer('Age must be an integer'),
      status: yup.string().oneOf(['Active', 'Inactive'], 'Invalid status').required('Status is required'),
      date: yup.string().required('Date is required'), // Add validation for the date field
      visitTime: yup.string().required('Visit Time is required'), // Add validation for the visitTime field
  });
  

    // const { control, handleSubmit, reset, setValue } = useForm<Patient>({
    //     resolver: yupResolver(validationSchema),
    //     defaultValues: {
    //         name: '',
    //         email: '',
    //         gender: 'Male',
    //         age: 0,
    //         status: 'Active',
    //         date: new Date().toLocaleDateString('en-GB'),
    //         visitTime: '10:00', // Default time
    //     },
    // });

    const getPatients = async () => {
      try {
        setLoading(true);
        //  await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await axios.get(
          `${apiUrl}/hospitals/2/doctors/1/patients`,
          {
            withCredentials: true,
            params: {
              pageSize: rowsPerPage,
              pageOffset: page,
              firstName: searchQueryName,
              lastName: searchQueryName,
              email: searchQueryEmail,
              phoneNumber: searchQueryPhone,
            },
          }
        );
  
        const { content, total } = response.data;
        setTotalItems(total);
        setPatients(content);
        // setPatientContext(content)
        console.log('Patient', response.data);
  
        const Patients = response.data.content;
        console.log(Patients);
        setPatients(Patients);
        setLoading(false);
      } catch (error) {
        console.log(error);
        console.log('Something went wrong');
        setLoading(false);
      }
    };

    useEffect(() => {
      getPatients();
    }, [
      page,
      rowsPerPage,
      searchQueryName,
      searchQueryEmail,
      searchQueryPhone,
      hospitalContext,
    ]);

    useEffect(()=>{
      getPatients();
    },[])

    // const handleEdit = (originalIndex: number) => {
    //     setEditIndex(originalIndex);
    //     const patient = patients[originalIndex];
    //     setValue('name', patient.name);
    //     setValue('email', patient.email);
    //     setValue('gender', patient.gender);
    //     setValue('age', patient.age);
    //     setValue('status', patient.status);
    //     setValue('date', patient.date);
    //     setValue('visitTime', patient.visitTime); // Set the visitTime value as well
    //     setIsEditing(true);
    //     setOpenEditDialog(true);
    // };

    const handleDelete = (originalIndex: number) => {
        setEditIndex(originalIndex);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = () => {
        if (editIndex !== null) {
            const updatedPatients = patients.filter((_, i) => i !== editIndex);
            setPatients(updatedPatients);
            setOpenDeleteDialog(false);
            setEditIndex(null);
        }
    };

    // const onSubmit = (data: Patient) => {
    //     if (isEditing && editIndex !== null) {
    //         const updatedPatients = patients.map((patient, index) =>
    //             index === editIndex ? data : patient
    //         );
    //         setPatients(updatedPatients);
    //         setIsEditing(false);
    //         setEditIndex(null);
    //     } else {
    //         setPatients([...patients, data]);
    //     }
    //     reset();
    //     setOpenEditDialog(false);
    //     setOpenAddDialog(false);
    // };

    const handleChangePage = (event: any, newPage: number) => {
      console.log('Page changed to:', newPage);
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
      const newRowsPerPage = parseInt(event.target.value);
      console.log('Rows per page changed to:', newRowsPerPage);
      setRowsPerPage(newRowsPerPage);
      setPage(0);
      setRowsPerPage(newRowsPerPage);
      getPatients();
    };

    // const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    //     setCurrentPage(page);
    // };

    // const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    //     setRowsPerPage(parseInt(event.target.value as string, 10));
    //     setCurrentPage(1); // Reset to the first page whenever rows per page changes
    // };

    // const displayedPatients = patients.slice(
    //     (currentPage - 1) * rowsPerPage,
    //     currentPage * rowsPerPage
    // ).map((patient, index) => ({
    //     ...patient,
    //     originalIndex: (currentPage - 1) * rowsPerPage + index
    // }));

    // Add Patient
  const handleAddPatient = async (formData: Form) => {
    try {
      const { data: responseData } = await axios.post(
        `${apiUrl}/hospitals/2/doctors/1/patient`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          bloodGroup: formData.bloodGroup,
          dob: formData.dob,
          digitalHealthCode: formData.digitalHealthCode,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          stateCode: formData.stateCode,
          countryCode: formData.countryCode,
          postalCode: formData.postalCode,
          isActive: formData.isActive,
          age:formData.age,
        },
        {
          withCredentials: true,
        }
      );
      if (responseData) {
        enqueueSnackbar('Patient added successfully', { variant: 'success' });
        setOpenAddDialog(false);
        getPatients();
      } else {
        console.log('Something went wrong');
      }
    } catch (error) {
      console.log(error);
      console.log('Something went wrong in input form');
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };


    return (
        <div className="container">
            <h2 style={{ height: '25px', color: '#2D3748', fontFamily: 'Poppins', fontSize: '18px', fontWeight: '600', lineHeight: '25.2px', textAlign: 'left' }}>Patients Data
                <div style={{ display: 'inline-block', marginLeft: '8px', position: 'relative', float: 'right', right: '0', marginRight: '6%' }}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            // reset();
                            setOpenAddDialog(true);
                        }}
                        style={{
                            backgroundColor: '#347E7D',
                            color: 'white',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            borderRadius: '6px 6px 6px 6px',
                            padding: '8px 16px',
                            width: 'Fixed (174px)px', height: 'Fixed (40px)px',
                            opacity: '0px',
                        }}
                    >
                        Book Appointment
                    </Button>
                </div>
            </h2>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#A0AEC0' }}>Patient Name</TableCell>
                            <TableCell sx={{ color: '#A0AEC0' }}>Gender</TableCell>
                            <TableCell sx={{ color: '#A0AEC0' }}>Age</TableCell>
                            <TableCell sx={{ color: '#A0AEC0' , paddingLeft:'40px'}}>Status</TableCell>
                            <TableCell sx={{ color: '#A0AEC0' }}>Date</TableCell>
                            <TableCell sx={{ color: '#A0AEC0' }}>Visit Time,</TableCell>
                            <TableCell sx={{ color: '#A0AEC0' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {patients.map((patient, index) => (
                            <TableRow key={index} className="table-row" >
                                <TableCell >
                                    <div style={{ display: 'flex', alignItems: 'center', color: '#2D3748', fontFamily: 'Roboto', fontSize: '14px', fontWeight: '700' }}>
                                        <div
                                            style={{
                                                backgroundColor: '#4FD1C5',
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '8px',
                                            }}
                                        />
                                        <div>
                                            <span>{patient.age}</span>
                                            <span
                                                className="email"
                                                style={{
                                                    display: 'block',
                                                    color: '#718096',
                                                    fontFamily: 'Roboto',
                                                    fontSize: '14px',
                                                    fontWeight: '400',
                                                    lineHeight: '19.6px',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                {patient.email}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell style={{ color: '#2D3748', fontFamily: 'Roboto', fontSize: '14px', fontWeight: '400', lineHeight: '19.6px', textAlign: 'left', paddingLeft:'25px'}}>{patient.gender}</TableCell>
                                <TableCell style={{ color: '#2D3748', fontFamily: 'Roboto', fontSize: '14px', fontWeight: '400', lineHeight: '19.6px', textAlign: 'left',paddingLeft:'20px',paddingRight:'30px' }}>{patient.age}</TableCell>
                                <TableCell style={{ color: '#2D3748', fontSize: '14px', fontWeight: '400', lineHeight: '19.6px', textAlign: 'left', }}>
                                    <StatusBadge status={patient.status} />
                                </TableCell>
                                <TableCell style={{ color: '#2D3748', fontFamily: 'Roboto', fontSize: '14px', fontWeight: '700', lineHeight: '19.6px', textAlign: 'left', paddingLeft:'0px' }}>{patient.date}</TableCell>
                                <TableCell style={{ color: '#2D3748', fontFamily: 'Roboto', fontSize: '14px', fontWeight: '700', lineHeight: '19.6px', textAlign: 'left', paddingLeft:'30px'}}>{patient.visitTime}</TableCell>
                                
                                <TableCell>
                                    <EditIcon
                                        style={{ cursor: 'pointer', marginRight: '8px' }}
                                        // onClick={() => handleEdit(patient.index)}
                                    />
                                    <DeleteIcon
                                        style={{ cursor: 'pointer', color: '#c23616' }}
                                        // onClick={() => handleDelete(patient.index)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                sx={{ marginTop: '5px' }}
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={totalItems}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>

            {/* <PaginationComponent
                totalItems={patients.length}
                itemsPerPage={rowsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            /> */}

            {/* <AddPatients
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                onSubmit={onSubmit}
                control={control}
                handleSubmit={handleSubmit}
            /> */}
            {/* 
            <EditPatientModal
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                onSubmit={onSubmit}
                control={control}
                handleSubmit={handleSubmit}
            /> */}

            {/* <DeleteConfirmationModal
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={handleDeleteConfirm}
            /> */}

              <AddPatientComponent
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                onSubmit={handleAddPatient}
              /> 

              
        </div>
    );
};

export default ListPatients;