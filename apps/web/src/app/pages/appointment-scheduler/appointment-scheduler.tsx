import styles from './appointment-scheduler.module.scss';
import React, { useContext, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Button, Modal, IconButton, Card, CardContent, Collapse, Fade } from '@mui/material';
import { borderRadius, color, styled } from '@mui/system';
import { Add, ArrowDropDown, CalendarToday, Tune, ArrowLeft, ArrowRight, Edit as EditIcon, Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormFields from './FormFields';
import { isSameDay } from 'date-fns';
import EditAppointment from './EditAppointment';
import Delete from './Delete';
import DoctorContext from '../../contexts/doctor-context';
import HospitalContext from '../../contexts/hospital-context';
import { useNavigate } from 'react-router-dom';

interface Appointment {
  name: string;
  description: string;
  date: Date;
  time: string;
  toTime: string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'center',
  height: '30.18px',
  width: '236.4px',
  minWidth: '236.4px',
}));

const StyledTableHeadCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: '#f4f4f4',
  fontWeight: 'bold',
}));

const AppointmentCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'white',
  margin: '2px',
  cursor: 'pointer',
  position: 'absolute',
  left: 0,
  right: 0,
  zIndex: 1,
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '8px',
    backgroundColor: 'rgba(6, 75, 79, 0.6)',
  },
}));

/* eslint-disable-next-line */
export interface AppointmentSchedulerProps {}

export function AppointmentScheduler(props: AppointmentSchedulerProps) {

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    description: yup.string().required('Description is required'),
    date: yup.date().required('Date is required'),
    time: yup.string().required('From Time is required'),
    toTime: yup.string().required('To Time is required'),
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const navigate=useNavigate();
  const doctorcontext=useContext(DoctorContext);
  const hospitalcontext=useContext(HospitalContext);

  const { control, handleSubmit, reset } = useForm<Appointment>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      date: new Date(),
      time: '09:00',
      toTime: '10:00',
    },
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const onSubmit = (data: Appointment) => {
    const newAppointment = {
      ...data,
      date: data.date,
    };
    setAppointments([...appointments, newAppointment]);
    handleCloseModal();
    reset();
  };

  const getAppointmentForSlot = (date: Date, timeSlot: string) => {
    return appointments.find(appointment => 
      isSameDay(appointment.date, date) && 
      appointment.time === timeSlot
    );
  };

  const getAppointmentStyle = (appointment: Appointment, isExpanded: boolean) => {
    return {
      top: '0',
      height: isExpanded ? '200px' : '100%',
      position: 'absolute' as const,
      width: '100%',
      overflow: 'hidden',
      zIndex: isExpanded ? 2 : 1,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    };
  };

  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return new Date(0, 0, 0, hours, minutes);
  };

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const generateTimeSlots = () => {
    const timeSlots = [];
    for (let i = 8; i <= 17; i++) {
      timeSlots.push(i < 12 ? `${i.toString().padStart(2, '0')}:00` : i === 12 ? '12:00' : `${(i - 12).toString().padStart(2, '0')}:00`);
    }
    return timeSlots;
  };

  const dates = generateDates();
  const timeSlots = generateTimeSlots();

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const toggleAppointmentDetails = (appointmentId: string) => {
    setExpandedAppointment(prevId => prevId === appointmentId ? null : appointmentId);
  };

  const handleEditClick = (appointment: Appointment, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedAppointment(appointment);
    setEditModalOpen(true);
  };

  return (
    <div style={{height:'calc(100vh - 1000px)'}}>
      <Box display="flex" justifyContent="space-between" alignItems="center"  marginLeft={5} marginRight={5} marginTop={3} marginBottom={2}>
        <Typography variant="h1" component="div" sx={{ color: 'rgba(0, 0, 0, 1)', }}>
          Appointment Scheduler
        </Typography>
        <Box display="flex" gap={0.5} alignItems="center">
          <Button
            variant="contained"
            // sx={{ backgroundColor:'rgba(6,75,79,1)', shadow:'rgba(0,0,0,0.25)', borderRadius:'6px', gap:'8px', width:'Fixed(210px)', height:'37px', }}
            onClick={handleOpenModal}
            startIcon={<Add />}
            sx={{ backgroundColor: '#064B4F', color: 'white' }}
          >
            {/* <Typography sx={{ color:'rgba(255,255,255,1)', lineHeight:'20px',fontSize:'18px',fontWeight:'600',fontFamily:'Inter', }}> */}
            Add Appointment
            {/* </Typography> */}
          </Button>

          <IconButton
            onClick={() => setCurrentDate(prevDate => {
              const newDate = new Date(prevDate);
              newDate.setDate(newDate.getDate() - 7);
              return newDate;
            })}
          >
            <ArrowLeft />
          </IconButton>

          <Button
            variant="outlined"
            endIcon={<ArrowDropDown />}
            sx={{ color: '#064B4F80', borderColor: '#064B4F80' }}
          >
            {dates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {dates[dates.length - 1].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Button>

          <IconButton
            onClick={() => setCurrentDate(prevDate => {
              const newDate = new Date(prevDate);
              newDate.setDate(newDate.getDate() + 7);
              return newDate;
            })}
          >
            <ArrowRight />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              backgroundColor: '#064B4F',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                backgroundColor: 'white',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={goToToday}
            >
              <CalendarToday sx={{ color: 'black' }} />
            </Box>
            <Box
              sx={{
                backgroundColor: '#064B4F',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={()=>navigate(`/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/appointments`)}
            >
              <Tune sx={{ color: 'white' }} />
            </Box>
          </Box>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{height:'calc(100vh - 80%)' , width:'calc(100vw - 20%)',  marginLeft: 5, marginRight:5, marginTop: 3,  marginBottom: 2}}>
        <Table >
          <TableHead >
            <TableRow  >
              <StyledTableHeadCell sx={{ color:'rgba(6,75,79,0.76)', fontSize:'16px', lineHeight:'33px', fontWeight:'600', fontFamily:'poppins', width:'40px',height:'20px', backgroundColor: 'white' }} >Time</StyledTableHeadCell>
              {dates.map((date, index) => (
                <StyledTableHeadCell key={index} sx={{  color:'rgba(6,75,79,0.76)', fontSize:'16px', lineHeight:'33px', fontWeight:'600', fontFamily:'poppins', width:'40px',height:'20px', backgroundColor: 'white' }}>
                  {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </StyledTableHeadCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody >
            {timeSlots.map((timeSlot, rowIndex) => (
              <TableRow key={rowIndex} sx={{height:'30px !important'}}>
                <StyledTableCell sx={{color:'rgba(141,141,141,1)', lineHeight:'30px',fontSize:'16px',fontWeight:'600', fontFamily:'poppins', width:'87px',height:'22.17px',}}>{timeSlot}</StyledTableCell>
                {dates.map((date, colIndex) => {
                  const appointment = getAppointmentForSlot(date, timeSlot);
                  const isExpanded = expandedAppointment === `${appointment?.date.toISOString()}-${appointment?.time}`;
                  return (
                    <StyledTableCell key={colIndex} style={{ position: 'relative', height: '73.18px', top: '-3px',}}>
                      {appointment && (
                        <AppointmentCard
                          onClick={() => toggleAppointmentDetails(`${appointment.date.toISOString()}-${appointment.time}`)}
                          style={getAppointmentStyle(appointment, isExpanded)}
                        >
                          <CardContent style={{ width: '100%', textAlign: 'center', backgroundColor:'white',}}>
                            {isExpanded && (
                              <>
                                <IconButton
                                  size="small"
                                  style={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 40,
                                  }}
                                  onClick={(event) => handleEditClick(appointment, event)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  style={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 5,
                                  }}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setDeleteModalOpen(true);
                                    setSelectedAppointment(appointment);
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </>
                            )}
                            <Fade in={!isExpanded}>
                              <Box>
                                <Typography variant="body2" component="div">
                                  {appointment.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {appointment.description}
                                </Typography>
                                <Typography variant="caption" display="block">
                                  {`${appointment.time} - ${appointment.toTime}`}
                                </Typography>
                              </Box>
                            </Fade>
                            <Fade in={isExpanded}>
                              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%' }}>
                                <Typography variant="body2" sx={{ color:'rgba(0,0,0,1)',lineHeight:'33px',fontSize:'22px',fontWeight:'600', fontFamily:'poppins',width:'83',height:'33',}}><strong>Name:</strong> {appointment.name} 
                                </Typography>
                                <Typography variant="body2"sx={{ color:'rgba(0,0,0,1)',fontFamily:'poppins',}}><strong>Description:</strong> {appointment.description}</Typography>
                                <Typography variant="body2" sx={{ color:'rgba(132,143,172,1)', lineHeight:'18px', fontSize:'12px',fontWeight:'600'}}>{`${appointment.time} - ${appointment.toTime}`}</Typography>
                              </Box>
                            </Fade>
                          </CardContent>
                        </AppointmentCard>
                      )}
                    </StyledTableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="add-appointment-modal"
        aria-describedby="modal-to-add-new-appointment"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px',
        }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon sx={{backgroundColor:'rgba(50, 50, 50, 1)',borderRadius:'50%', color:'white'}}/>
          </IconButton>
          <Typography variant="h6" component="h2" gutterBottom sx={{ color:'rgba(0,0,0,0.87)', lineHeight:'32px',fontSize:'24px',fontWeight:'400', fontFamily:'poppins', width:'678px',height:'32px',}}>
            Add Appointment
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormFields control={control} />
            <Button type="submit" variant="contained" sx={{ mt: 2 , backgroundColor:'rgba(52,126,125,1)', gap:'8px',borderRadius:'6px', width:'Fixed(150px)',height:'Fixed(40px)',}}>
              <Typography sx={{color:'rgba(255,255,255,1)', lineHeight:'20px',fontSize:'16px',fontWeight:'600', fontFamily:'poppins',}}>
              Add Appointment
              </Typography>
            </Button>   
          </form>
        </Box>
      </Modal>

      <EditAppointment
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        appointment={selectedAppointment}
        onSave={(updatedAppointment) => {
          setAppointments(appointments.map(app => 
            app === selectedAppointment ? updatedAppointment : app
          ));
          setEditModalOpen(false);
        }}
      />

      <Delete
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          // Logic to delete the appointment
          setAppointments(appointments.filter(app => app !== selectedAppointment));
          setDeleteModalOpen(false);
        }}
      />
    </div>
  );
}

export default AppointmentScheduler;
