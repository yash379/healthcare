import { Gender } from '@prisma/client';
import styles from './list-appointment.module.scss';
import AddDoctorComponent from '../list-doctor/add-doctor/add-doctor';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';


import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Card,
  CardContent,
  Typography,
  styled,
  Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { useParams } from 'react-router-dom';
import EditAppointment from './edit-appointment/edit-appointment';
import AddAppointment from './add-appointment/add-appointment';
import DeleteAppointment from './delete-appointment/delete-appointment';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

import * as React from 'react';
import Chip from '../../Components/chip/chip';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ListAppointmentProps {}

export enum StatusEnum {
  Scheduled = 'Scheduled',
  InProgress = 'In Progress',
  Cancelled = 'Cancelled',
  PendingConfirmation = 'Pending Confirmation',
}

// Define a mapping of status to background color
const statusColorMap: Record<StatusEnum, string> = {
  [StatusEnum.Scheduled]: '#d1e7dd', // light green
  [StatusEnum.InProgress]: '#ffebcc', // light yellow
  [StatusEnum.Cancelled]: '#f8d7da', // light red
  [StatusEnum.PendingConfirmation]: '#fff3cd', // light orange
};

interface Form {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  gender: Gender;
  age: number;
  date: Date;
  status: StatusEnum;
}

interface ViewAppointment {
  id: number;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  gender: Gender;
  age: number;
  date: Date;
  status: StatusEnum;
}

export function ListAppointment(props: ListAppointmentProps) {
  const apiUrl = environment.apiUrl;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQueryName, setSearchQueryName] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewData, setViewData] = useState<ViewAppointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState<ViewAppointment | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const params = useParams();
  // const [appointmentsData, setAppointmentsData] = useState<ListAppointment[]>([]);

  const [dummyAppointments, setDummyAppointments]=useState< ViewAppointment[]> ( [
    {
      id: 1,
      firstName: 'Omkar',
      lastName: 'Patil',
      mobileNumber: '1234567890',
      email: 'omkar.patil@example.com',
      gender: Gender.MALE,
      status: StatusEnum.InProgress,
      age: 30,
      date: new Date(),
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      mobileNumber: '0987654321',
      email: 'jane.smith@example.com',
      gender: Gender.FEMALE,
      status: StatusEnum.InProgress,
      age: 25,
      date: new Date(),
    },
    // More dummy data...
  ]);

  const getAllAppointments= useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/hospitals/${params.hospitalId}/doctors/1/patients/2/appointments`, {
        withCredentials: true,
        // params: {
        //   pageSize: rowsPerPage,
        //   pageOffset: page -1,
        //   name: searchQueryName,
        // },
      });
      // console.log(response.data[0].user)
      const {content, total} = response.data;
      setAppointmentsData(response.data.content);
      setTotalItems(total)
      console.log("Admin Data",response.data.content);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      setLoading(false);
    }
  }, [apiUrl]);
  
useEffect(() => {
 
  getAllAppointments();
}, [apiUrl, getAllAppointments]);
  


  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };

  const handleEditClick = (appointmentId: number) => {
    const selectedAppointment: ViewAppointment | undefined =
      dummyAppointments.find((appointment) => appointment.id === appointmentId);

    if (selectedAppointment) {
      setEditData(selectedAppointment);
      setSelectedAppointmentId(appointmentId);
      setIsEditModalOpen(true);
    }
  };

  // Function to open the delete confirmation modal
  const handleDeleteClick = (appointmentId: number) => {
    const selectedAppointment: ViewAppointment | undefined =
      dummyAppointments.find((appointment) => appointment.id === appointmentId);

    if (selectedAppointment) {
      setViewData(selectedAppointment);
      setSelectedAppointmentId(appointmentId);
      setIsDeleteModalOpen(true);
    }
  };

  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setSelectedAppointmentId(null);
    setIsDeleteModalOpen(false);
  };

  const deleteAppointment = async () => {
    try {
      if (selectedAppointmentId !== null) {
        await axios.delete(
          `${apiUrl}/hospitals/${params.hospitalId}/appointments/${selectedAppointmentId}`,
          {
            withCredentials: true,
          }
        );
        enqueueSnackbar('Appointment deleted successfully', {
          variant: 'success',
        });
        closeDeleteModal();
        getAppointment();
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  const getAppointment = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/hospitals/${params.hospitalId}/doctors`,
        {
          withCredentials: true,
          params: {
            pageSize: rowsPerPage,
            pageOffset: page,
            name: searchQueryName,
          },
        }
      );

      const { content, total } = response.data;
      setTotalItems(total);
      setLoading(false);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointment();
  }, [page, rowsPerPage, searchQueryName]);

  const handleFilterChange = () => {
    setPage(0);
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchQueryName]);

  const handleSearchNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQueryName(event.target.value);
    getAppointment();
  };

  const handleAddAppointment = async (formData: Form) => {
    try {
      const newAppointment = {
        id: dummyAppointments.length + 1, // This is just a dummy ID
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        age: formData.age,
        date: new Date(formData.date),
        status: formData.status, 
      };
  
      dummyAppointments.push(newAppointment); // For testing with dummy data
      setDummyAppointments([...dummyAppointments]); // Update state to trigger re-render
  
      enqueueSnackbar('Appointment added successfully', { variant: 'success' });
      setIsAddModalOpen(false);
      
      // Uncomment this if you're using an API to fetch appointments
      // getAppointment();
  
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };
  

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <Box className={styles['btn_container']}>
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            m: 2,
          }}
        >
          {/* Total Appointments Card */}
          <Card
            sx={{
              minWidth: 400,
              p: 2,
              borderRadius: 5,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <CardContent sx={{ display: 'flex' }}>
              <DescriptionOutlinedIcon
                sx={{
                  backgroundColor: '#5CA1D1',
                  borderRadius: '50%',
                  color: '#ffffff',
                  width: 30,
                  height: 30,
                  padding: 1,
                }}
              />
              <Box sx={{ paddingLeft: 2 }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ color: '#0B4FA6' }}
                >
                  Total Appointments
                </Typography>
                <Typography variant="h4" sx={{ color: '#000000' }}>
                  150
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Completed Appointments Card */}
          <Card
            sx={{
              minWidth: 400,
              p: 2,
              borderRadius: 5,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <CardContent sx={{ display: 'flex' }}>
              <DescriptionOutlinedIcon
                sx={{
                  backgroundColor: '#4CAF50', // Different color for completed appointments
                  borderRadius: '50%',
                  color: '#ffffff',
                  width: 30,
                  height: 30,
                  padding: 1,
                }}
              />
              <Box sx={{ paddingLeft: 2 }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ color: '#388E3C' }}
                >
                  Completed Appointments
                </Typography>
                <Typography variant="h4" sx={{ color: '#000000' }}>
                  100
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Pending Appointments Card */}
          <Card
            sx={{
              minWidth: 400,
              p: 2,
              borderRadius: 5,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <CardContent sx={{ display: 'flex' }}>
              <DescriptionOutlinedIcon
                sx={{
                  backgroundColor: '#FF9800', // Different color for pending appointments
                  borderRadius: '50%',
                  color: '#ffffff',
                  width: 30,
                  height: 30,
                  padding: 1,
                }}
              />
              <Box sx={{ paddingLeft: 2 }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ color: '#F57C00' }}
                >
                  Pending Appointments
                </Typography>
                <Typography variant="h4" sx={{ color: '#000000' }}>
                  50
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              mt: '20px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h1 style={{ marginTop: '10px' }}>Upcoming Appointments</h1>

            <AddAppointment
              open={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSubmit={handleAddAppointment}
            />
            <TextField
              type="text"
              variant="outlined"
              size="small"
              sx={{ ml: '10px' }}
              onChange={handleSearchNameChange}
              InputProps={{
                startAdornment: <SearchIcon color="action" />,
              }}
            />
          </Box>
          <Button
            sx={{ mr: '10px' }}
            variant="contained"
            color="primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <AddIcon fontSize="small" /> Add
          </Button>
        </Box>
        <Box
          className={styles['search-container']}
          sx={{ ml: 98, display: 'flex', direction: 'row' }}
        >
          <Box>
            {/* <Typography
                  sx={{
                    color: '#2B3674',
                    fontWeight: 'Bold',
                    fontFamily: 'DM Sans, sans-serif' ,// Using a fallback font
                    my:'20px'
                  }}
                >
                  Upcoming Appointments
                </Typography> */}
          </Box>
        </Box>
      </Box>

      {/* Table displaying appointments */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="appointment table">
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  <NavLink
                    to={`/appointments/${appointment.id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '&:hover': {
                          backgroundColor: '#f0f0f0', // Change this to your desired hover color
                          borderRadius: '8px', // Optional: adds rounded corners
                          padding: '4px', // Optional: adds padding inside the hover area
                        },
                      }}
                    >
                      <Avatar sx={{ bgcolor: '#4FD1C5', marginRight: 2 }}>
                        {getInitials(
                          appointment.firstName,
                          appointment.lastName
                        )}
                      </Avatar>
                      {`${appointment.firstName} ${appointment.lastName}`}
                    </Box>
                  </NavLink>
                </TableCell>

                <TableCell>{appointment.gender}</TableCell>
                <TableCell>{appointment.date.toDateString()}</TableCell>
                <TableCell>
                  {/* <Box
                    sx={{
                      display: 'inline-block',
                      padding: '2px 6px',
                      borderRadius: '12px',
                      backgroundColor: statusColorMap[appointment.status],
                      color: '#000',
                      textAlign: 'center',
                    }}
                  > */}
                  <Chip label="Info">{appointment.status}</Chip>

                  {/* </Box> */}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(appointment.id)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(appointment.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {isEditModalOpen && editData && (
        <EditAppointment
          open={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={(data) => {
            closeEditModal();
          }}
          initialData={editData}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteAppointment
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={deleteAppointment}
          appointmentData={viewData}
        />
      )}
    </Box>
  );
}

export default ListAppointment;
