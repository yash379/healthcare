import React, { useCallback, useContext, useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Avatar, Link } from "@mui/material";
import { blue } from "@mui/material/colors";
import axios from 'axios';
import { environment } from '../../../../environments/environment';
import { ViewAppointment } from "../../list-appoinment-new/list-appointments/list-appointments";
import HospitalContext from "../../../contexts/hospital-context";

const Appointments: React.FC = () => {

  const [appointmentsData, setAppointmentsData] = useState<ViewAppointment[]>(
    []
  );
  const apiUrl = environment.apiUrl;
  const hospitalcontext=useContext(HospitalContext);

  // Sample data for attended appointments
  const appointments = [
    { time: "08:00", name: "Emma Watson", issue: "Headache", date: "17 Aug 2024" },
    { time: "09:00", name: "Emma Watson", issue: "Headache", date: "17 Aug 2024" },
    { time: "10:00", name: "Emma Watson", issue: "Headache", date: "17 Aug 2024" },
    { time: "11:00", name: "Emma Watson", issue: "Headache", date: "17 Aug 2024" },
    { time: "01:00", name: "Emma Watson", issue: "Headache", date: "17 Aug 2024" },
  ];

  

  const getAllAppointments = useCallback(async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/appointments`,
        {
          withCredentials: true,
        }
      );
      // console.log(response.data[0].user)
      const { content, total } = response.data;
      setAppointmentsData(response.data.content);
      console.log('App Data', response.data.content);
    } catch (error) {
      console.error('Error fetching hospital data:', error);
    }
  }, [apiUrl,hospitalcontext?.hospital?.id]);

  useEffect(() => {
    getAllAppointments();
  }, [apiUrl,  hospitalcontext?.hospital?.id,  getAllAppointments]);

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    
    // Convert to Indian Standard Time (IST)
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, // 12-hour format
      timeZone: 'Asia/Kolkata' // Explicitly set to IST (Indian Time)
    };
  
    return date.toLocaleTimeString('en-IN', options);
  };
  return (
    <Box sx={{ padding: "20px", maxWidth: "400px", margin: "10px", backgroundColor: "#fff", alignSelf:'flex-start'
      //  borderRadius: "8px", 
      //  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" 
    }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" sx={{ fontWeight: "bold",color:'#064B4F' }}>Previous Appointment</Typography>
        <Link href="#" underline="none" color="#064B4F" fontSize="0.875rem" 
        sx={{
          textDecoration: "underline",
        }}
        >
          view all
        </Link>
      </Box>

      {/* Timeline Container */}
      <Box sx={{ position: "relative" }}>
        {appointmentsData.map((appointment, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 3,color:'#064B4F' }}>
            {/* Time Section */}
            <Box sx={{ width: "25%", textAlign: "center" }}>
              <Typography variant="body1" sx={{ fontWeight: "bold"}}>
                {formatTime(appointment.appointmentDate)}
              </Typography>
            </Box>

            {/* Line and Dot Section */}
            <Box sx={{ width: "10%", position: "relative", display: "flex", justifyContent: "center" }}>
              {/* Vertical Line */}
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  bottom: 0,
                  width: "2px",
                  top: -40,
                  height: "130px",
                  backgroundColor: "#064B4F",
                }}
              />
              {/* Dot */}
              <Box
                sx={{
                  position: "relative",
                  top: "0px",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#064B4F",
                  borderRadius: "50%",
                  zIndex: 1,
                }}
              />
            </Box>

            {/* Appointment Info Section */}
            <Box sx={{ width: "100%" }}>
              <Card sx={{ display: "flex", alignItems: "center", boxShadow: 2, borderRadius: "8px", padding: "8px" }}>
                <Avatar sx={{ bgcolor: blue[500], width: 40, height: 40, mr: 2 }} src="https://via.placeholder.com/40" />
                <CardContent sx={{ padding: "0px" }}>
                  <Typography variant="body1" fontWeight="bold">
                    {appointment.doctor.user.firstName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {appointment?.status.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {appointment.doctor?.user.email}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Appointments;
