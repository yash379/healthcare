import { Gender } from '@prisma/client';
import styles from './list-appointment.module.scss';
import AddDoctorComponent from '../list-doctor/add-doctor/add-doctor';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { useParams } from 'react-router-dom';
import EditAppointment from './edit-appointment/edit-appointment';
import AddAppointment from './add-appointment/add-appointment';
import DeleteAppointment from './delete-appointment/delete-appointment';

export interface ListAppointmentProps {}

interface Form {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  gender: Gender;
  age: number;
  date: Date;
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
}

export function ListAppointment(props: ListAppointmentProps) {
  const apiUrl = environment.apiUrl;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQueryName, setSearchQueryName] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewData, setViewData] = useState<ViewAppointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState<ViewAppointment | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const params = useParams();

  const dummyAppointments: ViewAppointment[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      mobileNumber: '1234567890',
      email: 'john.doe@example.com',
      gender: Gender.MALE,
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
      age: 25,
      date: new Date(),
    },
    // More dummy data...
  ];

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };

  const handleEditClick = (appointmentId: number) => {
    const selectedAppointment: ViewAppointment | undefined = dummyAppointments.find(
      (appointment) => appointment.id === appointmentId
    );

    if (selectedAppointment) {
      setEditData(selectedAppointment);
      setSelectedAppointmentId(appointmentId);
      setIsEditModalOpen(true);
    }
  };

  // Function to open the delete confirmation modal
  const handleDeleteClick = (appointmentId: number) => {
    const selectedAppointment: ViewAppointment | undefined = dummyAppointments.find(
      (appointment) => appointment.id === appointmentId
    );

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
        await axios.delete(`${apiUrl}/hospitals/${params.hospitalId}/appointments/${selectedAppointmentId}`, {
          withCredentials: true,
        });
        enqueueSnackbar('Appointment deleted successfully', { variant: 'success' });
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
      const response = await axios.get(`${apiUrl}/hospitals/${params.hospitalId}/doctors`, {
        withCredentials: true,
        params: {
          pageSize: rowsPerPage,
          pageOffset: page,
          name: searchQueryName,
        },
      });

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

  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryName(event.target.value);
    getAppointment();
  };

  const handleAddAppointment = async (formData: Form) => {
    try {
      const { data: responseData } = await axios.post(
        `${apiUrl}/hospitals/${params.hospitalId}/doctors`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          age: formData.age,
          date: formData.date,
        },
        { withCredentials: true }
      );

      if (responseData) {
        enqueueSnackbar('Doctor added successfully', { variant: 'success' });
        setIsAddModalOpen(false);
        getAppointment();
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
    <>
      <Box className={styles['btn_container']}>
        <h1>Appointment</h1>
        <Box>
          <AddAppointment
            open={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleAddAppointment}
          />
        </Box>
        <Box className={styles['search-container']}>
          <TextField
            type="text"
            variant="outlined"
            size="small"
            sx={{ mt: 2.3, mr: '10px' }}
            onChange={handleSearchNameChange}
            InputProps={{
              startAdornment: <SearchIcon color="action" />,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <AddIcon fontSize="small" /> Add
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="appointment table">
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile Number</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.firstName}</TableCell>
                  <TableCell>{appointment.lastName}</TableCell>
                  <TableCell>{appointment.email}</TableCell>
                  <TableCell>{appointment.mobileNumber}</TableCell>
                  <TableCell>{appointment.gender}</TableCell>
                  <TableCell>{appointment.age}</TableCell>
                  <TableCell>{appointment.date.toDateString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(appointment.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(appointment.id)}>
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
            initialData={editData} // Passing selected appointment data
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
    </>
  );
}

export default ListAppointment;
