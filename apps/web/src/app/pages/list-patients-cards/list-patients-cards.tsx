import styles from './list-patients-cards.module.scss';
import React, { useContext, useEffect, useState } from 'react';
import PatientCard from './PatientCard';
import DeleteConfirmationModal from './DeleteCard';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import HospitalContext from '../../contexts/hospital-context';
import { environment } from '../../../environments/environment';
import DoctorContext from '../../contexts/doctor-context';
import { ViewPatient } from '@healthcare/data-transfer-types';
import AddPatientComponent from '../list-patient/add-patient/add-patient';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { Gender } from '@prisma/client';
import { enqueueSnackbar } from 'notistack';

interface Patient {
  name: string;
  address: string;
  weight: number; // Change to number
  height: number; // Change to number
  bloodgroup: string; // Change from bloodGroup to bloodgroup
  profilePicture: string; // Add this line
}

interface Form {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  gender: Gender;
  bloodgroup: string;
  dob: Date;
  digitalHealthCode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  isActive: boolean;
}

export interface EditForm {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  gender: Gender;
  bloodgroup: string;
  dob: Date;
  digitalHealthCode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  isActive: boolean;
}

interface PatientListProps {
  patients: Patient[];
  onEditPatient: (index: number, updatedPatient: Patient) => void;
  onDeletePatient: (index: number) => void;
}

/* eslint-disable-next-line */
export interface ListPatientsCardsProps {
  // patients: Patient[];
  onEditPatient: (index: number, updatedPatient: Patient) => void;
  onDeletePatient: (index: number) => void;
}

export function ListPatientsCards({
  onEditPatient,
  onDeletePatient,
}: ListPatientsCardsProps) {
  const apiUrl = environment.apiUrl;

  const [activePatients, setActivePatients] = useState<ViewPatient[]>([]);
  const [patients, setPatients] = useState<ViewPatient[]>([]);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );
  const [editData, setEditData] = useState<ViewPatient | null>(null);

  const hospitalcontext = useContext(HospitalContext);
  const doctorcontext = useContext(DoctorContext);

  const navigate = useNavigate();

  const getPatients = async () => {
    try {
      //  await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(
        `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patients`,
        {
          withCredentials: true,
          // params: {
          //   pageSize: rowsPerPage,
          //   pageOffset: page-1,
          //   firstName: searchQueryName,
          //   lastName: searchQueryName,
          //   email: searchQueryEmail,
          //   phoneNumber: searchQueryPhone,
          // },
        }
      );

      const { content, total } = response.data;
      // setTotalItems(total);
      setActivePatients(content);
      setPatients(response.data.content);
      console.log('Patient', response.data);

      const Patients = response.data.content;
      console.log(Patients);
      // setActivePatients(Patients);
      // setLoading(false);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
      // setLoading(false);
    }
  };

  useEffect(() => {
    getPatients();
  }, [hospitalcontext?.hospital?.id, doctorcontext?.doctor?.id]);

  //Patient Update Function
  const handleEditClick = (patientId: number) => {
    const selectedPatient: ViewPatient | undefined = activePatients.find(
      (patient) => patient.id === patientId
    );

    if (selectedPatient) {
      setEditData(selectedPatient);
      setSelectedPatientId(patientId);
      // setPatientContext(selectedPatient); // Set the selected patient as the patient context
      console.log(selectedPatient, 'selectedPateont');
      navigate('/hospitals/:hospitalId/patients/edit/:patientId');
      // setIsEditModalOpen(true);
    }
  };

  // Edit Patient
  const handleUpdate = async (updateData: EditForm) => {
    try {
      const response = await axios.put(
        `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/patients/${selectedPatientId}`,
        {
          firstName: updateData.firstName,
          lastName: updateData.lastName,
          email: updateData.email,
          phoneNumber: updateData.phoneNumber,
          gender: updateData.gender,
          bloodgroup: updateData.bloodgroup,
          dob: updateData.dob,
          digitalHealthCode: updateData.digitalHealthCode,
          addressLine1: updateData.addressLine1,
          addressLine2: updateData.addressLine2,
          city: updateData.city,
          stateCode: updateData.stateCode,
          countryCode: updateData.countryCode,
          postalCode: updateData.postalCode,
          isActive: updateData.isActive,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response.data);

      if (response.data) {
        console.log('Building Name Updated Successfully');
        enqueueSnackbar('Patient details updated successfully', {
          variant: 'success',
        });
        getPatients();
        setIsModalOpen(false);
      } else {
        console.log('Update data not received');
      }
    } catch (error) {
      console.error(error);
      console.log('Something went wrong');
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  // Add Patient
  const handleAddPatient = async (formData: Form) => {
    try {
      const { data: responseData } = await axios.post(
        `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/patients`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          bloodgroup: formData.bloodgroup,
          dob: formData.dob,
          digitalHealthCode: formData.digitalHealthCode,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          stateCode: formData.stateCode,
          countryCode: formData.countryCode,
          postalCode: formData.postalCode,
          isActive: formData.isActive,
        },
        {
          withCredentials: true,
        }
      );
      if (responseData) {
        enqueueSnackbar('Patient added successfully', { variant: 'success' });
        setIsAddModalOpen(false);
        getPatients();
      } else {
        console.log('Something went wrong');
      }
    } catch (error) {
      console.log(error);
      console.log('Something went wrong in input form');
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  const handleEditChange = (field: keyof Patient, value: string) => {
    if (editingPatient) {
      setEditingPatient({ ...editingPatient, [field]: value });
    }
  };

  const handleEditSave = () => {
    if (editingPatient && editingIndex !== null) {
      onEditPatient(editingIndex, editingPatient);
      setEditingPatient(null);
      setEditingIndex(null);
    }
  };

  const handleEditCancel = () => {
    setEditingPatient(null);
    setEditingIndex(null);
  };

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteIndex !== null) {
      onDeletePatient(deleteIndex);
      setIsDeleteModalOpen(false);
      setDeleteIndex(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setDeleteIndex(null);
  };

  const handleViewDetails = (index: number) => {
    // Implement view details logic here
    console.log(`Viewing details of patient at index ${index}`);
  };

  return (
    <>
      <Box
        sx={{
          mt: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginLeft: '50px',
          marginRight: '20px'
        }}
      >
        <h1 style={{ marginTop: '5px', fontFamily: 'Inter, sans-serif' }}>Patients</h1>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            type="text"
            variant="outlined"
            size="small"
            sx={{ ml: '10px', height: '40px' }}
            InputProps={{
              startAdornment: <SearchIcon color="action" />,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2 }} 
            onClick={() =>
              navigate(
                `/hospitals/${hospitalcontext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patients/add`
              )
            }
          >
            <AddIcon fontSize="small" /> Add Patient
          </Button>
        </Box>
      </Box>
      <Box>
        <AddPatientComponent
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddPatient}
        />
      </Box>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          gap: '30px',
          marginLeft: '40px',
          rowGap: '20px',
        }}
      >
        {patients.map((patient, index) => (
          <div
            key={index}
            style={{ width: '200' }}
          >
            <PatientCard
              patient={patient}
              onEdit={() => handleEditClick(index)}
              onDelete={() => handleDeleteClick(index)}
              onViewDetails={() => handleViewDetails(index)}
            />
          </div>
        ))}
      </div>

      <Dialog open={!!editingPatient} onClose={handleEditCancel}>
        <DialogTitle>
          Edit Patient
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleEditCancel}
            aria-label="close"
            style={{
              position: 'absolute',
              right: 25,
              top: 8,
              color: '#323232',
            }}
          >
            <CancelIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editingPatient && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                value={editingPatient.name}
                onChange={(e) => handleEditChange('name', e.target.value)}
              />
              <TextField
                margin="dense"
                label="Address"
                type="text"
                fullWidth
                variant="outlined"
                value={editingPatient.address}
                onChange={(e) => handleEditChange('address', e.target.value)}
              />
              <TextField
                margin="dense"
                label="Weight (kg)"
                type="number"
                fullWidth
                variant="outlined"
                value={editingPatient.weight}
                onChange={(e) => handleEditChange('weight', e.target.value)}
              />
              <TextField
                margin="dense"
                label="Height (cm)"
                type="number"
                fullWidth
                variant="outlined"
                value={editingPatient.height}
                onChange={(e) => handleEditChange('height', e.target.value)}
              />
              <FormControl fullWidth margin="dense" variant="outlined">
                <InputLabel id="blood-group-label">Blood Group</InputLabel>
                <Select
                  labelId="blood-group-label"
                  value={editingPatient.bloodgroup}
                  onChange={(e) =>
                    handleEditChange('bloodgroup', e.target.value)
                  }
                  label="Blood Group"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleEditCancel}
            color="primary"
            variant="contained"
            sx={{ backgroundColor: 'white', width: '81px', height: '38px' }}
          >
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontWeight: '500',
                fontSize: '14px',
                lineHeight: '24px',
                letterSpacing: '0.4px',
                color: 'rgba(52, 126, 125, 1)',
                width: '55px',
                height: '24px',
              }}
            >
              Cancel
            </Typography>
          </Button>
          <Button
            onClick={handleEditSave}
            color="primary"
            variant="contained"
            sx={{
              backgroundColor: 'rgba(52, 126, 125, 1)',
              width: '175px',
              height: '38px',
              borderRadius: '6px',
              gap: '8px',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontWeight: '600',
                fontSize: '13px',
                lineHeight: '30px',
                color: 'rgba(255, 255, 255, 1)',
                width: '134px',
                height: '30px',
              }}
            >
              Save Changes
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}

export default ListPatientsCards;
