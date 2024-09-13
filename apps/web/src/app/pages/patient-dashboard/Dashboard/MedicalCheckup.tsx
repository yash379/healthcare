import { Avatar, Box, Button, Card, Divider, Typography } from '@mui/material'
import React from 'react'

const checkupData = [
  {
    time: "8am - 10pm",
    title: "Medical Checkup",
    doctor: "Dr Parajay",
  },
  {
    time: "9am - 12pm",
    title: "Dental Checkup",
    doctor: "Dr Smith",
  },
  {
    time: "10am - 2pm",
    title: "Eye Checkup",
    doctor: "Dr Johnson",
  }
];

function MedicalCheckup() {
  return (
    <div style={{width:'50%'}}>
      <Box sx={{ display: 'flex' }} >
        <Box>
          <Card
            sx={{
              // padding: 2,
              paddingLeft: 2,
              paddingBottom: 2.2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '150%',
              marginLeft: '2%',
              // height: '87%',
              borderRadius: '10px',
              // margin:'24PX 0PX 0PX 16PX'
             
            }}
          >
            {checkupData.map((checkup, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  width: '100%',
                  marginTop: 3,
                  alignItems: 'center',
                  flexDirection: "row",
                  margin: "20px 0px 0px 0px",
                }}
              >
                <Divider
                  orientation="horizontal"
                  flexItem
                  sx={{
                    backgroundColor: 'red',
                    width: '4px',
                    margin: '0 20px',
                    alignSelf: 'left',                  
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    marginTop: 3,
                    flexDirection: "column",
                    alignItems: 'left',
                  }}
                >
                  <Typography color="textPrimary"
                  sx={{ color: '#000000', 
                  fontWeight: 400 ,
                  fontSize: '16px',
                  
                  }}>
                    {checkup.time}
                  </Typography>

                  <Typography variant="h6" color="textPrimary" 
                  sx={{ color: '#000000',
                    fontSize: '18px',
                   }}>
                    {checkup.title}
                  </Typography>

                  <Typography color="textPrimary"
                   sx={{ color: '#000000',
                    fontWeight: 300 ,
                    fontSize: '14px'
                    }}>
                    {checkup.doctor}
                  </Typography>
                </div>
              </Box>
            ))}
          </Card>
        </Box>
      </Box>
    </div>
  )
}

export default MedicalCheckup
