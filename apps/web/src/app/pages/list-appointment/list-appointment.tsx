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
  CircularProgress,
  Stack,
  Pagination,
  PaginationItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { useParams } from 'react-router-dom';
import EditAppointment from './edit-appointment/edit-appointment';
import AddAppointment from './add-appointment/add-appointment';
import DeleteAppointment from './delete-appointment/delete-appointment';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { format } from 'date-fns';
import * as React from 'react';
import Chip from '../../Components/chip/chip';
import Loading from '../../Components/loading/loading';
import { ViewAllUser } from '@healthcare/data-transfer-types';
import StatusChip from '../../Components/chip/statusChip';
import DoctorContext from '../../contexts/doctor-context';
import { HospitalContext } from '../../contexts/hospital-context';
// import { ListAppointment } from '@healthcare/data-transfer-types';


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

interface ViewAppointment {
  id: number;
  appointmentDate: string;
  status: { id: number; code: string; name: string };
  patient: PatientDetailsDto;
  doctor: DoctorDetailsDto;
}

interface PatientDetailsDto {
  user: UserDetailsDto;
}
interface DoctorDetailsDto {
  user: UserDetailsDto;
}

// DTO for detailed user information (part of PatientDetails)
interface UserDetailsDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface Form {
  patient: ViewAllUser | null;
  appointmentDate: Date;
  statusId: number;
}

// interface ViewAppointment {
//   id: number;
//   firstName: string;
//   lastName: string;
//   mobileNumber: string;
//   email: string;
//   gender: Gender;
//   age: number;
//   date: Date;
//   status: StatusEnum;
// }

export function ListAppointment(props: ListAppointmentProps) {
  const apiUrl = environment.apiUrl;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQueryName, setSearchQueryName] = useState<string>('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewData, setViewData] = useState<ViewAppointment | null>(null);
  // const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState<ViewAppointment | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const params = useParams();
  const [appointmentsData, setAppointmentsData] = useState<ViewAppointment[]>(
    []
  );
  const doctorContext = useContext(DoctorContext);
  const hospitalContext = useContext(HospitalContext);
  console.log("doctor context", doctorContext)
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [appointmentCount, setAppointmentCount]=useState<{
    "total": number,
    "pending": number,
    "confirmed": number,
    "inProgress": number,
    "completed": number,
    "declined": number
  } | null>(null);

  const getAllAppointments = useCallback(async () => {
    try {
      // setLoading(true);
      const response = await axios.get(
        `${apiUrl}/hospitals/${hospitalContext?.hospital?.id}/appointments`,
        {
          withCredentials: true,
          params: {
            pageSize: rowsPerPage,
            pageOffset: page - 1,
            // appointmentDate: searchQueryName,
          },
        }
      );
      // console.log(response.data[0].user)
      const { content, total } = response.data;
      setAppointmentsData(response.data.content);
      setTotalItems(total);
      console.log('Admin Data', response.data.content);
      // setLoading(false);
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      // setLoading(false);
    }
  }, [apiUrl, doctorContext?.doctor?.id, hospitalContext?.hospital?.id, page, rowsPerPage]);

  useEffect(() => {
    getAllAppointments();
  }, [apiUrl, page, rowsPerPage, getAllAppointments]);

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };

  const handleEditClick = (appointmentId: number) => {
    const selectedAppointment: ViewAppointment | undefined = appointmentsData.find(
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
    const selectedAppointment: ViewAppointment | undefined = appointmentsData.find(
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



  const getAllDoctors = async () => {
    try {
      // setLoading(true);
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
      // setLoading(false);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
      // setLoading(false);
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, [page, rowsPerPage, searchQueryName]);


  const deleteAppointment = async () => {
    try {
      if (selectedAppointmentId !== null) {
        await axios.delete(
          `${apiUrl}/hospitals/${hospitalContext?.hospital?.id}/doctors/1/patients/1/appointments/${selectedAppointmentId}`,
          {
            withCredentials: true,
          }
        );
        getAllAppointments();
        enqueueSnackbar('Appointment deleted successfully', {
          variant: 'success',
        });
        closeDeleteModal();
        
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  const handleFilterChange = () => {
    setPage(1);
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchQueryName]);

  const handleSearchNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQueryName(event.target.value);
    getAllAppointments();
  };

  // Add Appointment
  const handleAddAppointment = async (formData: Form) => {
    try {
      await setIsAddModalOpen(false);
      // setIsLoadingModalOpen(true);

      const { data: responseData } = await axios.post(
        `${apiUrl}/hospitals/${hospitalContext?.hospital?.id}/doctors/1/patients/${formData?.patient?.id}/appointments`,
        {
          appointmentDate: formData.appointmentDate,
          statusId: formData.statusId,
        },
        {
          withCredentials: true,
        }
      );
      if (responseData) {
        // setIsLoadingModalOpen(false);
        enqueueSnackbar('Appointment added successfully', { variant: 'success' });
        setIsAddModalOpen(false);
        getAllAppointments();
      } else {
        console.log('Something went wrong');
        // setIsLoadingModalOpen(false);
      }
      console.log('Appointment added successfully', responseData);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong in input form');
      enqueueSnackbar('Something went wrong', { variant: 'error' });
      // setIsLoadingModalOpen(false);
    }
  };


  // Edit Appointment
  const handleUpdate = async (formData: Form) => {
    try {
      await setIsAddModalOpen(false);
      // setIsLoadingModalOpen(true);

      const { data: responseData } = await axios.put(
        `${apiUrl}/hospitals/${hospitalContext?.hospital?.id}/doctors/1/patients/${formData?.patient?.id}/appointments/${selectedAppointmentId}`,
        {
          appointmentDate: formData.appointmentDate,
          statusId: formData.statusId,
        },
        {
          withCredentials: true,
        }
      );
      if (responseData) {
        // setIsLoadingModalOpen(false);
        enqueueSnackbar('Appointment updated successfully', { variant: 'success' });
        setIsAddModalOpen(false);
        getAllAppointments();
      } else {
        console.log('Something went wrong');
        // setIsLoadingModalOpen(false);
      }
      console.log('Appointment updated successfully', responseData);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong in input form');
      enqueueSnackbar('Something went wrong', { variant: 'error' });
      // setIsLoadingModalOpen(false);
    }
  };

  const getCounts=async()=>{
    try {
      // await setIsAddModalOpen(false);
      // setIsLoadingModalOpen(true);

      const { data: responseData } = await axios.get(
        `${apiUrl}/hospitals/${hospitalContext?.hospital?.id}/appointment-count`,
        {
          withCredentials: true,
        }
      );
      setAppointmentCount(responseData);
      console.log('Appointment counts:', responseData);
    } catch (error) {
      console.log('eror infetching counts:',error);
    }
  }

  useEffect(()=>{
    getCounts();
  },[apiUrl,hospitalContext?.hospital?.id]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const handleChangePage = (event: any, newPage: number) => {
    console.log('Page changed to:', newPage);
    setPage(newPage);
  };

  const pageCount = Math.ceil(totalItems / rowsPerPage);

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
              minWidth: '30%',
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
                  {appointmentCount?.total}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Completed Appointments Card */}
          <Card
            sx={{
              minWidth: '30%',
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
                {appointmentCount?.completed}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Pending Appointments Card */}
          <Card
            sx={{
              minWidth: '30%',
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
                {appointmentCount?.pending}
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
            {/* <Loading
              open={isLoadingModalOpen}
              onClose={() => setIsLoadingModalOpen(false)}
            /> */}

            {/* <TextField
              type="text"
              variant="outlined"
              size="small"
              sx={{ ml: '10px' }}
              onChange={handleSearchNameChange}
              InputProps={{
                startAdornment: <SearchIcon color="action" />,
              }}
            /> */}
          </Box>
          {/* <Button
            sx={{ mr: '10px' }}
            variant="contained"
            color="primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <AddIcon fontSize="small" /> Add
          </Button> */}
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
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Appointment Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {/* {loading ? ( */}
                {/* <TableCell align="center" colSpan={7} >
                  <CircularProgress size='small' />
                </TableCell> */}
              {/* ) :  */}
              {Array.isArray(appointmentsData) && appointmentsData.length > 0 ? (
            appointmentsData.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        // '&:hover': {
                        //   backgroundColor: '#f0f0f0', // Change this to your desired hover color
                        //   borderRadius: '8px', // Optional: adds rounded corners
                        //   padding: '4px', // Optional: adds padding inside the hover area
                        // },
                      }}
                    >
                       
                      {/* <Avatar sx={{ bgcolor: '#4FD1C5', marginRight: 2 }}>
                        
                        {getInitials(
                          appointment.patient.user.firstName,
                          appointment.patient.user.lastName
                        )}
                      </Avatar> */}
                      <NavLink
                    to={`/appointments/${appointment.id}`}
                    className={styles['socname']}
                  >
                      {`${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`}
                      </NavLink>
                    </Box>
                  
                </TableCell>

                <TableCell>{appointment.patient.user.email}</TableCell>
                <TableCell>{appointment.patient.user.phoneNumber}</TableCell>
                <TableCell>{appointment.doctor.user.firstName} {appointment.doctor.user.lastName}</TableCell>
                <TableCell>{format(new Date(appointment.appointmentDate), 'MM/dd/yyyy')}</TableCell>
                <TableCell>
                  {appointment.status.name === 'INPROGRESS' ? (
                    <StatusChip label="Primary" width="100px">
                      InProgress
                    </StatusChip>
                  ) : (
                    ''
                  )}
                  {appointment.status.name === 'PENDING' ? (
                    <StatusChip label="Warning" width="100px">
                      Pending
                    </StatusChip>
                  ) : (
                    ''
                  )}
                  {appointment.status.name === 'CANCELLED' ? (
                    <StatusChip label="Error" width="100px">
                      Cancelled
                    </StatusChip>
                  ) : (
                    ''
                  )}
                  {appointment.status.name === 'CONFIRMED' ? (
                    <StatusChip label="Success" width="100px">
                      Confirmed
                    </StatusChip>
                  ) : (
                    ''
                  )}

                  {/* </Box> */}
                </TableCell>
                <TableCell>
                  {/* <IconButton onClick={() => handleEditClick(appointment.id)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(appointment.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton> */}
                </TableCell>
              </TableRow>
             ))
            ) : (
              <TableRow>
                <TableCell
                  sx={{
                    textAlign: 'center',
                  }}
                  colSpan={5}
                >
                  No Appointment found
                </TableCell>
              </TableRow>
            )}
            {/* } */}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2} className={styles['paginationContainer']}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handleChangePage}
          color="primary"
          renderItem={(item) => (
            <PaginationItem {...item} className={styles['paginationItem']} />
          )}
          siblingCount={1}
          boundaryCount={1}
          showFirstButton
          showLastButton
        />
      </Stack>
      {isEditModalOpen && editData && (
        <EditAppointment
          open={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={(data) => {
            handleUpdate(data);
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
