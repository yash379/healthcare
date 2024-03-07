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

/* eslint-disable-next-line */
export interface SelectHospitalProps {}

export function SelectHospital(props: SelectHospitalProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState([0]);
  const user=useContext(UserContext);
  const navigate=useNavigate();

  useEffect(()=>{
    if(user?.hospitalRoles?.length > 1){
      return;
    }else{
      navigate(`/dashboard/${user?.hospitalRoles[0].hospitalId}`);
    }
  },[user?.hospitalRoles.length, navigate]);

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
    }
  };

  const handleRadioChange = (value: number) => () => {
    setSelected(value);
    navigate(`/dashboard/${value}`);
  };

  console.log("user context:",user);
  console.log("user context scoietty:",user?.hospitalRoles);
  console.log("user context scoietty length:",user?.hospitalRoles.length);


  return (
    
      <div className={styles['login-page']}>
        {/* <h1>Welcome to SelectHospital!</h1> */}
        <div className={styles['form-container']}>
          <Box className={styles['hospital-header']}>
             <h1 >Select Hospital</h1>
          </Box>
          <div className={styles['hospital-list']}>
            <List sx={{ bgcolor: 'background.paper' }}>
                {user?.hospitalRoles.map((value) => {
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
                          <ListItemText id={labelId} primary={` ${value.hospitalName}`} />
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
