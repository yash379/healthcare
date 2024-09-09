import styles from './list-appointments.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Grid,
} from '@mui/material';
import { Add, CalendarToday, Tune, ArrowDropDown } from '@mui/icons-material';
// import AddDoctorComponent from '../list-doctor/add-doctor/add-doctor';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  styled,
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
import axios from 'axios';
import { environment } from '../../../../environments/environment';
import { useParams } from 'react-router-dom';
import EditAppointment from '../hospital-edit-appointment/hospital-edit-appointment';
import AddAppointment from '../hospital-add-appointment/hospital-add-appointment';
import DeleteAppointment from '../hospital-delete-appointment/hospital-delete-appointment';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { format } from 'date-fns';
import Chip from '../../../Components/chip/chip';
import StatusChip from '../../../Components/chip/statusChip';
import Loading from '../../../Components/loading/loading';
import { ViewAllUser } from '@healthcare/data-transfer-types';


interface Appointment {
  name: string;
  time: string;
  description: string;
  date: string;
}


/* eslint-disable-next-line */
export interface ListAppointmentsProps {}

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

export interface ViewAppointment {
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
  doctor: ViewAllUser | null;
  patient: ViewAllUser | null;
  appointmentDate: Date;
  statusId: number;
}


export function ListAppointments(props: ListAppointmentsProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState<ViewAppointment | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const params = useParams();
  const [appointmentsData, setAppointmentsData] = useState<ViewAppointment[]>(
    []
  );
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [appointmentStatus, setAppointmentStatus] = useState({ total:0,pending: 0, inProgress: 0, cancelled: 0, confirmed: 0 });
  const [viewAppointment, setViewAppointment]=useState(false);

  const navigate=useNavigate()

  useEffect(() => {
    getCounts();
  }, []);


  const getCounts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/hospitals/${params.hospitalId}/appointment-count`, { withCredentials: true });

      setAppointmentStatus(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/hospitals/${params.hospitalId}/appointments`,
        {
          withCredentials: true,
          params: {
            pageSize: rowsPerPage,
            pageOffset: page -1,
            // appointmentDate: searchQueryName,
          },
        }
      );
      // console.log(response.data[0].user)
      const { content, total } = response.data;
      setAppointmentsData(response.data.content);
      setTotalItems(total);
      console.log('Admin Data', response.data.content);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      setLoading(false);
    }
  }, [apiUrl, page, params.hospitalId, rowsPerPage]);

  useEffect(() => {
    getAllAppointments();
  }, [apiUrl, page, params.hospitalId, rowsPerPage, getAllAppointments]);

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
    getAllDoctors();
  }, [page, rowsPerPage, searchQueryName]);


  const deleteAppointment = async () => {
    try {
      if (selectedAppointmentId !== null) {
        await axios.delete(
          `${apiUrl}/hospitals/${params.hospitalId}/doctors/${viewData?.doctor.user.id}/patients/${viewData?.patient.user.id}/appointments/${selectedAppointmentId}`,
          {
            withCredentials: true,
          }
        );
        getAllAppointments();
        getCounts();
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
      setIsLoadingModalOpen(true);

      const { data: responseData } = await axios.post(
        `${apiUrl}/hospitals/${params.hospitalId}/doctors/${formData?.doctor?.id}/patients/${formData?.patient?.id}/appointments`,
        {
          appointmentDate: formData.appointmentDate,
          statusId: formData.statusId,
        },
        {
          withCredentials: true,
        }
      );
      if (responseData) {
        setIsLoadingModalOpen(false);
        enqueueSnackbar('Appointment added successfully', { variant: 'success' });
        setIsAddModalOpen(false);
        getAllAppointments();
        getCounts();
      } else {
        console.log('Something went wrong');
        setIsLoadingModalOpen(false);
      }
      console.log('Appointment added successfully', responseData);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong in input form');
      enqueueSnackbar('Something went wrong', { variant: 'error' });
      setIsLoadingModalOpen(false);
    }
  };


  // Edit Appointment
  const handleUpdate = async (formData: Form) => {
    try {
      await setIsAddModalOpen(false);
      setIsLoadingModalOpen(true);

      const { data: responseData } = await axios.put(
        `${apiUrl}/hospitals/${params.hospitalId}/doctors/${formData?.doctor?.id}/patients/${formData?.patient?.id}/appointments/${selectedAppointmentId}`,
        {
          appointmentDate: formData.appointmentDate,
          statusId: formData.statusId,
        },
        {
          withCredentials: true,
        }
      );
      if (responseData) {
        setIsLoadingModalOpen(false);
        enqueueSnackbar('Appointment updated successfully', { variant: 'success' });
        setIsAddModalOpen(false);
        getAllAppointments();
        getCounts();
      } else {
        console.log('Something went wrong');
        setIsLoadingModalOpen(false);
      }
      console.log('Appointment updated successfully', responseData);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong in input form');
      enqueueSnackbar('Something went wrong', { variant: 'error' });
      setIsLoadingModalOpen(false);
    }
  };

  const handleChangePage = (event: any, newPage: number) => {
    console.log('Page changed to:', newPage);
    setPage(newPage);
  };

  const pageCount = Math.ceil(totalItems / rowsPerPage);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };



  // Fetch data from the API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('https://mocki.io/v1/ddfc1b5f-06c4-42ed-b2f6-e0b3dd4e251f');
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const handleAccept = (id: number, value:boolean) => {
    console.log(`Appointment ${id} accepted.`);
    setViewAppointment(value);
  };

  const handleView=(id: number, value:boolean)=>{
    navigate(`/hospitals/${params.hospitalId}/doctors/${params.doctorId}/appointments/${id}`);
    setViewAppointment(value);
  }

  const handleDecline = (id: number) => {
    console.log(`Appointment ${id} declined.`);
  };

  return (
    <Box sx={{ height: '100vh'}}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
        <Typography variant="h1">
          Appointment
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsAddModalOpen(true)}
            sx={{ backgroundColor: '#064B4F', color: 'white' }}
          >
            Add Appointment
          </Button>
          <AddAppointment
              open={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSubmit={handleAddAppointment}
          />

          {/* Button with ArrowDropDown icon */}
          <Button
            variant="outlined"
            endIcon={<ArrowDropDown />}
            sx={{ color: '#064B4F80', borderColor: '#064B4F80' }}
          >
            Dec 14 - Dec 17
          </Button>

          {/* Combined Calendar and Tune icons */}
          <Box
            sx={{
              display: 'flex',
              backgroundColor: '#064B4F',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            {/* Calendar Icon on the left side */}
            <Box
              sx={{
                backgroundColor: 'white',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CalendarToday sx={{ color: 'black' }} />
            </Box>
            {/* Tune Icon on the right side */}
            <Box
              sx={{
                backgroundColor: '#064B4F',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Tune sx={{ color: 'white' }} />
            </Box>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {appointmentsData.map((appointment, index) => (
          <Grid item xs={12} sm={6} md={6} key={index} flexWrap="wrap">
            <Card
              sx={{
                width: '400px',
                height: '175px',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                marginRight: '10px',
                marginLeft: '15px',
              }}
            >
              <CardHeader
                avatar={<Avatar src="https://randomuser.me/api/portraits/men/75.jpg" />}
                title={`${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`}
                subheader={appointment.appointmentDate}
              />
              <CardContent sx={{ paddingLeft: '68px', position: 'relative', bottom: '24px',paddingBottom:'0px' }}>
                <Typography variant="body2" color="textSecondary">
                  {/* {appointment.description} */}
                  {appointment.patient.user.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {/* {appointment.description} */}
                  {appointment.patient.user.phoneNumber}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {/* {appointment.description} */}
                  {appointment.doctor.user.firstName} {appointment.doctor.user.lastName}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  justifyContent: 'space-between',
                  // paddingRight: '36px',
                  // paddingLeft: '70px',
                  position: 'relative',
                  bottom: '18px',
                  paddingTop: '0px',
                  paddingInline:'10px'
                }}
              >
                <Button
                  variant="outlined"
                  sx={{ borderRadius: '12px', color: '#82A4A6', borderColor: '#82A4A6' }}
                  onClick={() => handleDecline(index)}
                >
                  Decline Appointment
                </Button>
                {viewAppointment ? <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#064B4F',
                    color: 'white',
                    position: 'relative',
                    float: 'right',
                    borderRadius: '12px',
                  }}
                  onClick={() => handleView(appointment.id,false)}
                >
                  View Appointment
                </Button> 
                : <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#064B4F',
                    color: 'white',
                    position: 'relative',
                    float: 'right',
                    borderRadius: '12px',
                    // width:'-webkit-fill-available'
                  }}
                  onClick={() => handleAccept(appointment.id,true)}
                >
                  Accept Appointment
                </Button>}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ListAppointments;
