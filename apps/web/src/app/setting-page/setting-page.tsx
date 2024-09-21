import styles from './setting-page.module.scss';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, Divider, List, ListItem, ListItemText, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
/* eslint-disable-next-line */
export interface SettingPageProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SettingForm) => void;
}

interface SettingForm {
  address: string;
  city: string;
  stateCode?: string;
  postalCode: string;
}


export function SettingPage(props: SettingPageProps) {

  const validationSchema = yup.object().shape({
    address: yup.string().required('address is required'),
    city: yup.string().required('City is required'),
    stateCode: yup.string().required('State Code is required'),
    postalCode: yup.string().required('Postal Code is required'),
  });
  const { handleSubmit, control, reset, formState: { errors }, watch, setValue } = useForm<SettingForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      isActive: true
    }
  });

  return (
    <div className={styles['container']}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Top Section with background and Avatar */}
        <Box
          sx={{
            backgroundColor: 'rgba(8, 50, 52, 0.25)',
            width: '1610px',
            height: '194px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '8px',
          }}
        >
          {/* Avatar Positioned Over the Box */}
          <Avatar
            alt="Avatar"
            src="/static/images/avatar/1.jpg"
            variant="circular"
            sx={{
              height: '70px',
              width: '70px',
              position: 'absolute',
              bottom: '-40px',
              left: '20%',
              transform: 'translateX(-50%)',
            }}
          />
          {/* Name Positioned Beside the Avatar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'absolute',
              bottom: '-50px',
              left: 'calc(50% + 60px)', // Move name beside avatar
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', color: '#ffffff' }}
            >
              John Doe
            </Typography>
          </Box>
        </Box>

        {/* Below Section with two Flex Col Boxes */}
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
            marginTop: '50px',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'rgba(247, 249, 249, 1)',
              width: '400px',
              height: '300px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '8px',
              padding: '20px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                width: '100%', // Make buttons stretch to the width of the container
                alignItems: 'center',
              }}
            >
              <Button
                sx={{
                  backgroundColor: 'rgba(6, 75, 79, 1)',
                  color: 'white',
                  width: '80%', // Adjust the width of the button as needed
                  '&:hover': {
                    backgroundColor: 'rgba(6, 75, 79, 0.8)', // Optional: darken the button on hover
                  },
                }}
              >
                Edit
              </Button>

              <Button
                sx={{
                  backgroundColor: 'rgba(247, 249, 249, 1)',
                  color: 'rgba(6, 75, 79, 1)',
                  border: '1px solid rgba(6, 75, 79, 1)',
                  width: '80%', // Adjust the width of the button as needed
                  '&:hover': {
                    backgroundColor: 'rgba(247, 249, 249, 0.8)', // Optional: lighten the button on hover
                  },
                }}
              >
                Remove
              </Button>
            </Box>

            <Box
              sx={{
                marginTop: '10px',
                width: '90%', // Make the list stretch to the width of the container
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '10px',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Image requirements:
              </Typography>
              <List component="ol" sx={{ paddingLeft: '5px' }}>
                <ListItem>
                  <ListItemText primary="Min. 400 x 400px" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Max. 2MB" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Your face or company logo" />
                </ListItem>
              </List>
            </Box>
          </Box>

          <Box
            sx={{
              backgroundColor: 'rgba(247, 249, 249, 1)',
              width: '500px',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            {/* Title Section */}
            <Typography
              variant="h6"
              sx={{ marginBottom: '16px', color: '#0E6053' }}
            >
              Personal Info
            </Typography>

            <Divider />
            {/* Info Section */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                lineHeight: 1.6,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  marginTop: '10px'
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold', }}>
                  Name :{' '}
                </Typography>
                <Typography variant="body2" sx={{ marginLeft: '10px' }}>
                  {' '}
                  Emma Watson
                </Typography>
              </Box>

              {/* Height, Gender, Blood Type, Number, Emergency Contact */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                {/* Labels and Values for Height and Gender */}
                <Box sx={{ display: 'flex', gap: '20px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Height
                    </Typography>
                    <Typography variant="body2">6.5ft</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Gender
                    </Typography>
                    <Typography variant="body2">Female</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Blood Type
                    </Typography>
                    <Typography variant="body2">O+</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Number
                    </Typography>
                    <Typography variant="body2">899-372-7336</Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Emergency Contact
                  </Typography>
                  <Typography variant="body2">000-000-000</Typography>
                </Box>
              </Box>

              {/* Date of Birth */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: '10px'
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Date Of Birth
                </Typography>
                <Typography variant="body2">13/09/1999</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
  sx={{
    backgroundColor: 'rgba(6, 75, 79, 0.01)',
    width: '77%',
    height: '50px',
    borderRadius: '8px',
    position: 'relative', // Ensure the top property is effective
    top: '15px', // Adjust the value as needed
    display: 'flex', // Center the content
    alignItems: 'center', // Center vertically
  }}
>
  <Typography sx={{ color: 'rgba(6, 75, 79, 1)', fontWeight: 'bold' }}>
    Address
  </Typography>
</Box>



        <Box
          sx={{
            backgroundColor: 'rgba(6, 75, 79, 0.01)',
            width: '77%',
            height: '200px',
            borderRadius: '8px',
            padding: '16px', // Add some padding for better spacing
            position: 'relative', // Ensure the top property is effective
            top: '40px', // Adjust the value as needed
          }}
        >
          {/* Address Field */}
          <Box sx={{ flex: '1', mr: 1 }}> {/* Adjust margins as needed */}
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{ required: 'Address is required' }}
              render={({ field }) => (
                <TextField
                  id="outlined-multiline-static" // Set the ID
                  label="Address*" // Use your desired label
                  multiline
                  rows={4} // Adjust the number of rows as needed
                  {...field}
                  placeholder="Enter your address here"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-root': {
                      height: 'auto', // Auto height
                      minHeight: '100px', // Minimum height for paragraph feel
                    },
                  }}
                />
              )}
            />
          </Box>
          <Box sx={{marginTop:'10px'}}>

            <Box display="flex" justifyContent="space-between">
              <Box sx={{ flex: '1', mr: 1 }}> {/* Adjust margins as needed */}
                <Controller
                  name="city"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Field 1 is required' }}
                  render={({ field }) => (
                    <TextField
                      type=""
                      className="form-control"
                      placeholder="city"
                      {...field}
                      label="city"
                      error={!!errors.city}
                      helperText={errors.city?.message}
                      sx={{ width: '100%' }}
                    />
                  )}
                />
              </Box>
              <Box sx={{ flex: '1', mx: 1 }}>
                <Controller
                  name="stateCode"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'stateCode is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      className="form-control"
                      placeholder="stateCode"
                      {...field}
                      label="stateCode"
                      error={!!errors.stateCode}
                      helperText={errors.stateCode?.message}
                      sx={{ width: '100%' }}
                    />
                  )}
                />
              </Box>
              <Box sx={{ flex: '1', ml: 1 }}>
                <Controller
                  name="postalCode"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'postalCode is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      className="form-control"
                      placeholder="postalCode"
                      {...field}
                      label="postalCode"
                      error={!!errors.postalCode}
                      helperText={errors.postalCode?.message}
                      sx={{ width: '100%' }}
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>


        </Box>

      </Box>

    </div>
  );
}

export default SettingPage;
