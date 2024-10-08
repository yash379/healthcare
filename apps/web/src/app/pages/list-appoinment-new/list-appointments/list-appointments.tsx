import styles from './list-appointments.module.scss';
import React, { useCallback, useContext, useEffect, useState } from 'react';
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
import HospitalContext from '../../../contexts/hospital-context';
import DoctorContext from '../../../contexts/doctor-context';
import AppointmentContext from '../../../contexts/appointment-context';

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
  viewAppointment: boolean;
  declineAppointment: boolean;
  declinedAppointment: boolean;
  acceptAppointment: boolean;
  appointment: boolean;
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

interface Status {
  id: number;
  code: string;
  name: string;
}
[];

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
  const [appointmentCount, setAppointmentCount] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    cancelled: 0,
    confirmed: 0,
  });
  // const [viewAppointment, setViewAppointment]=useState(false);
  // const [declineAppointment, setDeclineAppointment]=useState(true);
  // const [declinedAppointment, setDeclinedAppointment]=useState(false);
  // const [acceptAppointment, setAcceptAppointment]=useState(true);
  const [appointment, setAppointment] = useState<ViewAppointment>();
  const [appointmentStatuses, setAppointmentStatus] = useState<Status[] | null>(
    null
  );

  const [status, setStatus] = useState<Status | null>(null);

  const hospitalcontext = useContext(HospitalContext);
  const doctorcontext = useContext(DoctorContext);
  const appointmentcontext = useContext(AppointmentContext);

  console.log('appointmentcontext:', appointmentcontext);

  const navigate = useNavigate();

  useEffect(() => {
    getCounts();
    getStatuses();
  }, []);

  const getCounts = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/hospitals/${params.hospitalId}/appointment-count`,
        { withCredentials: true }
      );

      setAppointmentCount(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getStatuses = async () => {
    try {
      const response = await axios.get(`${apiUrl}/appointmentStatuses`, {
        withCredentials: true,
      });

      setAppointmentStatus(response.data);
      console.log('Appointment statuses:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/hospitals/${params.hospitalId}/doctors/${params.doctorId}/appointments`,
        {
          withCredentials: true,
          // params: {
          //   pageSize: rowsPerPage,
          //   pageOffset: page -1,
          //   appointmentDate: searchQueryName,
          //   sortBy:'desc',
          //   sortOrder:'desc'
          // },
        }
      );
      // console.log(response.data[0].user)
      const { content, total } = response.data;
      // setAppointmentsData(response.data.content);
      const updatedAppointmentsData = content.map(
        (appointment: ViewAppointment) => ({
          ...appointment,
          acceptAppointment: true,
          declineAppointment: true,
          viewAppointment: false,
          declinedAppointment: false,
        })
      );
      setAppointmentsData(updatedAppointmentsData);
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
    const selectedAppointment: ViewAppointment | undefined =
      appointmentsData.find((appointment) => appointment.id === appointmentId);
    if (selectedAppointment) {
      setEditData(selectedAppointment);
      setSelectedAppointmentId(appointmentId);
      setIsEditModalOpen(true);
    }
  };

  // Function to open the delete confirmation modal
  const handleDeleteClick = (appointmentId: number) => {
    const selectedAppointment: ViewAppointment | undefined =
      appointmentsData.find((appointment) => appointment.id === appointmentId);
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
        enqueueSnackbar('Appointment added successfully', {
          variant: 'success',
        });
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
  const handleUpdate = async (
    appoinmentId: number,
    appoinmentDoctor: DoctorDetailsDto,
    appointmentPatient: PatientDetailsDto,
    statusId: number,
    appointmentDate: string
  ) => {
    try {
      await setIsAddModalOpen(false);
      setIsLoadingModalOpen(true);

      const { data: responseData } = await axios.put(
        `${apiUrl}/hospitals/${params.hospitalId}/doctors/${appoinmentDoctor.user.id}/patients/${appointmentPatient.user.id}/appointments/${appoinmentId}`,
        {
          appointmentDate: appointmentDate,
          statusId: statusId,
        },
        {
          withCredentials: true,
        }
      );
      if (responseData) {
        setIsLoadingModalOpen(false);
        enqueueSnackbar('Appointment updated successfully', {
          variant: 'success',
        });
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
        const response = await fetch(
          'https://mocki.io/v1/ddfc1b5f-06c4-42ed-b2f6-e0b3dd4e251f'
        );
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  // useEffect(()=>{
  //   appointmentsData.map((appointment)=>{
  //     appointment.acceptAppointment=true;
  //     appointment.declineAppointment=true;
  //     appointment.viewAppointment=false;
  //     appointment.declinedAppointment=false;
  //   });
  // },[appointmentsData]);

  // useEffect(()=>{
  //   appointmentsData.map((appointment)=>{
  //     appointment.declineAppointment=false;
  //     appointment.declinedAppointment=true;
  //     appointment.acceptAppointment=false;
  //   })
  // },[appointment?.declineAppointment])
  console.log('appointmentsData:', appointmentsData);

  const handleAccept = useCallback(
    (appointment: ViewAppointment, value: boolean) => {
      console.log(`Appointment ${id} accepted.`);
      // handleUpdate(appointment.id,appointment.doctor,appointment.patient,3,appointment.appointmentDate);
      // setStartAppointment(true);
      // setAcceptAppointment(false);
      // setViewAppointment(true);
      // setDeclineAppointment(value)
      // setDeclinedAppointment(value);
      // appointment.acceptAppointment=false;
      // appointment.viewAppointment=true;
      // appointment.declineAppointment=false;
      // appointment.declinedAppointment=false;
      // const acceptstatus = appointmentStatuses?.find((item)=>item.name==='CONFIRMED')
      // if (acceptstatus) {
      //   setStatus(acceptstatus);
      // }
      const updatedAppointmentsData = appointmentsData.map((appt) => {
        if (appt.id === appointment.id) {
          return {
            ...appt,
            acceptAppointment: false,
            viewAppointment: true,
            declineAppointment: false,
            declinedAppointment: false,
            status: { id: 2, code: '2', name: 'CONFIRMED' },
          };
        }
        return appt;
      });
      setAppointmentsData(updatedAppointmentsData);
      // setAppointment(appointment);
    },
    [appointmentsData, appointment]
  );

  const handleView = useCallback(
    (appointment: ViewAppointment, value: boolean) => {
      const updatedAppointment = {
        ...appointment,
        acceptAppointment: true,
        viewAppointment: false,
        declineAppointment: true,
        declinedAppointment: false,
        status: { id: 3, code: '3', name: 'INPROGRESS' },
      };
      setAppointment(updatedAppointment);

      appointmentcontext?.setAppointment(updatedAppointment);

      handleUpdate(
        updatedAppointment.id,
        updatedAppointment.doctor,
        updatedAppointment.patient,
        3,
        updatedAppointment.appointmentDate
      );

      navigate(
        `/hospitals/${params.hospitalId}/doctors/${params.doctorId}/patients/${appointment.patient.user.id}/patient-detail`
      );

      const acceptstatus = appointmentStatuses?.find(
        (item) => item.name === 'INPROGRESS'
      );
      if (acceptstatus) {
        setStatus(acceptstatus);
      }
      // setStatus()
      // setAppointment(appointment);
    },
    [appointmentsData, appointment]
  );

  console.log('appt:', appointment);

  const handleDecline = useCallback(
    (appointment: ViewAppointment, id: number) => {
      // handleUpdate(appointment.id,appointment.doctor,appointment.patient,5,appointment.appointmentDate);
      // // setDeclineAppointment(false);
      // setViewAppointment(false);
      // setAcceptAppointment(false);
      // setDeclinedAppointment(true);
      // appointment.declinedAppointment=true;
      // appointment.acceptAppointment=false;
      // appointment.viewAppointment=false;
      // appointment.declineAppointment=false;

      const updatedAppointmentsData = appointmentsData.map((appt) => {
        if (appt.id === appointment.id) {
          return {
            ...appt,
            acceptAppointment: false,
            viewAppointment: false,
            declineAppointment: false,
            declinedAppointment: true,
            status: { id: 5, code: '5', name: 'DECLINED' },
          };
        }
        return appt;
      });
      setAppointmentsData(updatedAppointmentsData);

      console.log(`Appointment ${id} declined.`);
      const acceptstatus = appointmentStatuses?.find(
        (item) => item.name === 'CANCELLED'
      );
      // if (acceptstatus) {
      //   setStatus(acceptstatus);
      // }
      // setStatus();
    },
    [appointmentsData, appointment]
  );

  // useEffect(()=>{
  //   const changeAppointmentStatus = async () => {
  //     try {
  //       const response = await axios.put(`${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patient/${appointment?.patient?.user?.id}/appointments/${appointment?.id}`,{
  //         ...appointment,
  //         status:status
  //       },{
  //         withCredentials:true
  //       });
  //       console.log("status changed:", response.data);
  //       setAppointments(response.data);
  //     } catch (error) {
  //       console.error('Error fetching appointments:', error);
  //     }
  //   };

  //   changeAppointmentStatus();

  // },[status,appointment]);

  // const formatDate = (isoDateString: string) => {
  //   const date=new Date(isoDateString).toLocaleDateString();
  //   const time=new Date(isoDateString).toLocaleTimeString();
  //   const response=date+''+time;
  //   return response; // Convert ISO string to local date format
  // };

  const formatDate = (dateTime: string) => {
    const date = new Date(dateTime);

    // Convert to Indian Standard Time (IST)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long', // Can be 'short', 'numeric', or '2-digit'
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, // 12-hour format, can set to false for 24-hour
      timeZone: 'Asia/Kolkata', // IST time zone
    };

    return date.toLocaleString('en-IN', options);
  };

  return (
    <Box sx={{ height: '80vh', marginRight: 5, marginLeft: 5 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        marginLeft={3}
        marginTop={3}
      >
        <Typography variant="h1">Appointment</Typography>
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
          {/* <Button
            variant="outlined"
            endIcon={<ArrowDropDown />}
            sx={{ color: '#064B4F80', borderColor: '#064B4F80' }}
          >
            Dec 14 - Dec 17
          </Button> */}

          {/* Combined Calendar and Tune icons */}
          <Box
            sx={{
              display: 'flex',
              backgroundColor: '#064B4F',
              borderRadius: '10px',
              overflow: 'hidden',
              height: '40px'
            }}
          >
             {/* Tune Icon on the left side */}
             <Box
              sx={{
                backgroundColor: '#064B4F',
                border: '1px solid #064B4F',
                borderRadius: '10px',
                borderTopRightRadius: '0px',
                borderBottomRightRadius: '0px',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Tune sx={{ color: 'white', pointer:'cursor' }} />
            </Box>

            {/* Calendar Icon on the right side */}
            <Box
              sx={{
                backgroundColor: 'white',
                border: '1px solid #064B4F',
                borderRadius: '10px',
                borderTopLeftRadius: '0px',
                borderBottomLeftRadius: '0px',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor:'pointer'
              }}
              onClick={() =>
                navigate(
                  `/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/scheduler`
                )
              }
            >
              <CalendarToday sx={{ color: 'black' }} />
            </Box>
           
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {appointmentsData.map((appointment, index) => (
          <Grid item xs={12} sm={6} md={6} key={index} flexWrap="wrap">
            <Card
              sx={{
                width: '100%',
                height: '230px',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                marginRight: '10px',
                marginLeft: '15px',
              }}
              key={index}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '16px', 
                }}
              >
                {/* Patient Info (Avatar, Name, and Date) */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ backgroundColor: '#064B4F' }}>
                    {`${appointment.patient.user.firstName.charAt(
                      0
                    )}${appointment.patient.user.lastName.charAt(0)}`}
                  </Avatar>
                  <Box sx={{ marginLeft: '16px' }}>
                    <Typography variant="h4" fontWeight="bold">
                      {`${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(appointment.appointmentDate)}
                    </Typography>
                  </Box>
                </Box>

                {/* Status Chip */}
                <Box>
                  {appointment.status.name === 'PENDING' && (
                    <StatusChip label="Warning" width="100px">
                      Pending
                    </StatusChip>
                  )}
                  {appointment.status.name === 'CONFIRMED' && (
                    <StatusChip label="Success" width="100px">
                      Confirmed
                    </StatusChip>
                  )}
                  {appointment.status.name === 'INPROGRESS' && (
                    <StatusChip label="Primary" width="100px">
                      In Progress
                    </StatusChip>
                  )}
                  {appointment.status.name === 'COMPLETED' && (
                    <StatusChip label="Success" width="100px">
                      Completed
                    </StatusChip>
                  )}
                  {appointment.status.name === 'DECLINED' && (
                    <StatusChip label="Error" width="100px">
                      Declined
                    </StatusChip>
                  )}
                </Box>
              </Box>

              <CardContent
                sx={{
                  paddingLeft: '68px',
                  position: 'relative',
                  bottom: '45px',
                  paddingBottom: '0px',
                }}
              >
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
                  {appointment.doctor.user.firstName}{' '}
                  {appointment.doctor.user.lastName}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  justifyContent: 'space-between',
                  // paddingRight: '36px',
                  // paddingLeft: '70px',
                  position: 'relative',
                  bottom: '36px',
                  paddingTop: '0px',
                  paddingInline: '10px',
                }}
                key={index}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    marginTop: '50px',
                    marginBottom: '40px',
                    marginLeft: '50px',
                    position: 'absolute',
                  }}
                >
                  {appointment.declineAppointment && (
                    <Button
                      variant="outlined"
                      sx={{
                        borderRadius: '12px',
                        color: '#82A4A6',
                        borderColor: '#82A4A6',
                        position: 'relative',
                      }}
                      onClick={() => handleDecline(appointment, index)}
                      disabled={appointment.status.name === 'COMPLETED'}
                    >
                      Decline Appointment
                    </Button>
                  )}
                  {appointment.acceptAppointment && (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#064B4F',
                        color: 'white',
                        position: 'relative',
                        borderRadius: '12px',
                      }}
                      disabled={appointment.status.name === 'COMPLETED'}
                      onClick={() => handleAccept(appointment, false)}
                    >
                      Accept Appointment
                    </Button>
                  )}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '50px',
                    marginBottom: '40px',
                    width: '97%',
                    position: 'absolute',
                  }}
                >
                  {appointment.viewAppointment && (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#064B4F',
                        display: 'flex',
                        justifyContent: 'center',
                        color: 'white',
                        borderRadius: '12px',
                        width: '500px',
                      }}
                      onClick={() => handleView(appointment, false)}
                    >
                      Start Appointment
                    </Button>
                  )}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '50px',
                    marginBottom: '40px',
                    width: '97%',
                    position: 'absolute',
                  }}
                >
                  {appointment.declinedAppointment && (
                    <Button
                      variant="outlined"
                      sx={{
                        borderRadius: '12px',
                        color: '#82A4A6',
                        borderColor: '#82A4A6',
                        width: '500px',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                      onClick={() => handleDecline(appointment, index)}
                      disabled
                    >
                      Appointment Declined
                    </Button>
                  )}
                </div>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ListAppointments;
