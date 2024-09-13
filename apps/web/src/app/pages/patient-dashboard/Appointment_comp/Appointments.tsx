import React from "react";
import { Box, Card, CardContent, Typography, Avatar, Link } from "@mui/material";
import { blue } from "@mui/material/colors";

const Appointments: React.FC = () => {
  // Sample data for attended appointments
  const appointments = [
    { time: "08:00", name: "Emma Watson", issue: "Headache", date: "17 Aug 2024" },
    { time: "09:00", name: "Emma Watson", issue: "Headache", date: "17 Aug 2024" },
    { time: "10:00", name: "Emma Watson", issue: "Headache", date: "17 Aug 2024" },
    { time: "11:00", name: "Emma Watson", issue: "Headache", date: "17 Aug 2024" },
    { time: "01:00", name: "Emma Watson", issue: "Headache", date: "17 Aug 2024" },
  ];

  return (
    <Box sx={{ padding: "20px", maxWidth: "400px", margin: "auto", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
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
        {appointments.map((appointment, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 3,color:'#064B4F' }}>
            {/* Time Section */}
            <Box sx={{ width: "25%", textAlign: "center" }}>
              <Typography variant="body1" sx={{ fontWeight: "bold"}}>
                {appointment.time}
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
                    {appointment.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {appointment.issue}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {appointment.date}
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
