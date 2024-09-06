import { useContext, useEffect, useState } from 'react';
import styles from './select-hospital.module.scss';
import { UserContext } from '../../contexts/user-context';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import { Box } from '@mui/material';
import { HospitalContext } from '../../contexts/hospital-context';

/* eslint-disable-next-line */
export interface SelectHospitalProps {}

export function SelectHospital(props: SelectHospitalProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState([0]);
  const usercontext=useContext(UserContext);
  const navigate=useNavigate();

  const hospitalcontext=useContext(HospitalContext);
  console.log("user context:", usercontext);

  useEffect(()=>{
    if(usercontext?.user && usercontext?.user?.hospitalRoles && usercontext?.user?.hospitalRoles.length > 1){
      return;
    }else{
      navigate(`/dashboard/${usercontext?.user && usercontext?.user?.hospitalRoles && usercontext?.user?.hospitalRoles[0].hospitalId}`);
      // navigate('/dashboard');
    }
  },[usercontext?.user && usercontext?.user?.hospitalRoles && usercontext?.user?.hospitalRoles.length, navigate, usercontext?.user && usercontext?.user?.hospitalRoles]);


  
  
  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    console.log("value:",value)

    // Navigate to hospital dashboard when the checkbox is checked
    if (currentIndex === -1) {
      navigate(`/dashboard/${value}`); // Adjust the route as needed
      // navigate('/dashboard')
    }
  };

  const handleRadioChange = (value: number) => () => {
    setSelected(value);
  
    navigate(`/dashboard/${value}`);
    // navigate('/dashboard')
  };

  console.log("user context:",usercontext);
  console.log("user context scoietty:",usercontext?.user?.hospitalRoles);
  // console.log("user context scoietty length:",usercontext?.user?.hospitalRoles length);


  return (
    
      <div className={styles['login-page']}>
        {/* <h1>Welcome to SelectHospital!</h1> */}
        <div className={styles['form-container']}>
          <Box className={styles['hospital-header']}>
             <h1 >Select Hospital</h1>
          </Box>
          <div className={styles['hospital-list']}>
            <List sx={{ bgcolor: 'background.paper' }}>
                {usercontext?.user?.hospitalRoles && usercontext?.user?.hospitalRoles.map((value) => {
                    const labelId = `checkbox-list-label-${value.hospitalId}`;

                    return (
                      <ListItem key={value.hospitalId} disablePadding className={styles['hospital-list-item']}>
                        <ListItemButton role={undefined} onClick={handleRadioChange(value.hospitalId)} dense>
                          <ListItemIcon>
                          <Radio
                            checked={selected === value.hospitalId}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                          </ListItemIcon>
                          <ListItemText id={labelId} primary={` ${value.hospitalId} ${value.hospitalRole}`} />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
            </List>
            </div>
        </div>
      </div>
  
  );

}

export default SelectHospital;
