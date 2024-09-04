import styles from './setting-page.module.scss';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider'; // Import Divider
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import TextField from '@mui/material/TextField';

/* eslint-disable-next-line */
export interface SettingPageProps {}

export function SettingPage(props: SettingPageProps) {
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className={styles['container']}>
      <Box sx={{ width: '100%', typography: 'body1', backgroundColor:'#ffffff' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="settings tabs">
              <Tab icon={<PersonIcon />} label="Account" value="1" />
              <Tab icon={<LockIcon />} label="Security" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1" style={{height: 555}}>
            {/* Profile Photo Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, border: '1px solid #DDE1E6', padding: 2, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <Avatar sx={{ width: 70, height: 70 }} />
                <Box sx={{ ml: 2, mt: 2 }}>
                  <Button
                    component="label"
                    sx={{
                      fontSize: '1rem',
                      padding: '18px 30px',
                      color: '#064B4F',
                      border: '2px solid #064B4F',
                    }}
                  >
                    Upload Image
                    <input type="file" hidden />
                  </Button>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1, ml: 6, color: '#064B4F' }}>
                    Remove
                  </Typography>
                </Box>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
              <Box sx={{ ml: 10 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Image Requirements:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Min. 400 x 400px<br />
                  • Max. 2MB<br />
                  • Your face or company logo
                </Typography>
              </Box>
            </Box>

            {/* User Details Section */}
            <Box sx={{ mt: 4, border: '1px solid #DDE1E6', padding: 2, borderRadius: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                User Details
              </Typography>
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Address"
                  variant="outlined"
                  fullWidth
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#064B4F',
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#053A3D',
                    },
                  }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value="2">Security Settings Content</TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}

export default SettingPage;
