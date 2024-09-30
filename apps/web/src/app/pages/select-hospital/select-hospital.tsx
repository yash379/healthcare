import { useContext, useEffect, useState } from 'react';
import styles from './select-hospital.module.scss';
import { UserContext } from '../../contexts/user-context';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Box, Card } from '@mui/material';
import { HospitalContext } from '../../contexts/hospital-context';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Gender } from '@prisma/client';
import { HospitalRoleDto } from '@healthcare/data-transfer-types';
import Doctors from '../../../assets/Doctors.svg';
import Patients from '../../../assets/Patients.svg';
/* eslint-disable-next-line */
export interface SelectHospitalProps {}

interface PatientResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  digitalHealthCode: string;
  gender: Gender;
  age: number;
  bloodGroup: string;
  dob: string; // ISO 8601 date string
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  countryCode: string;
  stateCode: string;
  chronicDiseases: [];
  acuteDiseases: [];
  doctors: Doctor[];
  isActive: boolean;
}

interface Doctor {
  doctorId: number;
  doctorGender: Gender;
  doctorDoctorCode: string;
  doctorSpeciality: string;
  doctorFirstName: string;
  doctorLastName: string;
  doctorEmail: string;
  doctorPhoneNumber: string;
}
export function SelectHospital(props: SelectHospitalProps) {
  const [hospitalId, setHospitalId] = useState<number | null>(null);
  const [roles, setRoles] = useState<HospitalRoleDto[]>();
  const navigate = useNavigate();
  const usercontext = useContext(UserContext);
  const hospitalContext = useContext(HospitalContext);
  const apiUrl = environment.apiUrl;

  const getHospital = async () => {
    const response = await axios.get(`${apiUrl}/hospitals/${hospitalId}`, {
      withCredentials: true,
    });
    hospitalContext?.setHospital(response.data);
  };

  useEffect(() => {
    getHospital();
    setRoles(usercontext?.user?.hospitalRoles);
    localStorage.removeItem('doctor');
    localStorage.removeItem('patient');
  }, [hospitalId, hospitalContext, usercontext]);

  const handleRadioChange = (Id: any, value: any) => () => {
    setHospitalId(Id);

    if (value === 'ADMIN') {
      navigate(`/hospitals/${Id}/admin/${usercontext?.user?.id}`);
    } else if (value === 'DOCTOR') {
      navigate(`/hospitals/${Id}/doctors/${usercontext?.user?.doctorId}`);
    } else if (value === 'PATIENT') {
      navigate(`/hospitals/${Id}/patients/${usercontext?.user?.patientId}`);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f7fb',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          width: '800px',
        }}
      >
        <Box style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Inter, sans-serif' }}>Select Your Role</h1>
        </Box>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
          <List sx={{ display: 'flex', gap: '40px' }}>
            {roles?.map((value) => {
              const labelId = `checkbox-list-label-${value.hospitalId}`;
              const imageUrl =
                value.hospitalRole === 'DOCTOR' ? Doctors : Patients;

              return (
                <ListItem
                  key={value.hospitalId}
                  disablePadding
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '250px',
                    margin: '0 10px',
                  }}
                >
                  {/* Card with image */}
                  <Box
                    style={{
                      width: '290px',
                      height: '200px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      backgroundColor: '#fff',
                      marginBottom: '15px', 
                    }}
                  >
                    <div
                      onClick={handleRadioChange(
                        value.hospitalId,
                        value.hospitalRole
                      )}
                      style={{
                        cursor: 'pointer',
                        borderRadius: '12px',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={
                          value.hospitalRole === 'DOCTOR' ? 'Doctor' : 'Patient'
                        }
                        style={{
                          width: '250px',
                          height: '200px',
                          transition:
                            'transform 0.3s ease, box-shadow 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                          e.currentTarget.style.boxShadow =
                            '0 4px 12px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </Box>

                  {/* Hospital name and role outside the card */}
                  <ListItemText
                    id={labelId}
                    primaryTypographyProps={{
                      sx: {
                        textAlign: 'center',
                        marginTop: '5px',
                        fontSize: '16px',
                        fontWeight: 700, 
                        color: '#6c757d',
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        textAlign: 'center',
                        fontSize: '14px',
                        fontWeight: 700, 
                        color: '#6c757d',
                      },
                    }}
                    primary={value.hospitalName}
                    secondary={value.hospitalRole}
                  />
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
