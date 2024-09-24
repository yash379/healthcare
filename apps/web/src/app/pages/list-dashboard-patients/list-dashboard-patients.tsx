import styles from './list-dashboard-patients.module.scss';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  Stack,
  Pagination,
  PaginationItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import Breadcrumbs from '../../Components/bread-crumbs/bread-crumbs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPatientComponent from '../list-patient/add-patient/add-patient';
import EditPatientComponent from '../list-patient//edit-patient/edit-patient';
import DeletePatientComponent from '../list-patient//delete-patient/delete-patient';
// import ViewPatientComponent from '../view-patient/view-patient';
import { enqueueSnackbar } from 'notistack';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { Hospital, ViewPatient } from '@healthcare/data-transfer-types';
import AddIcon from '@mui/icons-material/Add';
import { HospitalContext } from '../../contexts/hospital-context';
import { Gender } from '@prisma/client';
import DoctorContext from '../../contexts/doctor-context';

/* eslint-disable-next-line */
export interface ListDashboardPatientsProps {}

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

export function ListDashboardPatients(props: ListDashboardPatientsProps) {
  const apiUrl = environment.apiUrl;
  const [activePatients, setActivePatients] = useState<ViewPatient[]>([]);
  const [viewPatientOpen, setViewPatientOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQueryName, setSearchQueryName] = useState<string>('');
  const [searchQueryEmail, setSearchQueryEmail] = useState<string>('');
  const [searchQueryPhone, setSearchQueryPhone] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [PatientToDeleteId, setPatientToDeleteId] = useState<number | null>(
    null
  );
  const [totalItems, setTotalItems] = useState(0);
  const [editData, setEditData] = useState<ViewPatient | null>(null);
  const [viewData, setViewData] = useState<ViewPatient | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  console.log('hospital id:', id);
  const params = useParams();


  const hospitalContext = useContext(HospitalContext);
  console.log('Hospital Context:', hospitalContext);
  const doctorcontext=useContext(DoctorContext);
  console.log('hospital context hospital id:', hospitalContext?.hospital?.id);
  const [deleteData, setDeleteData] = useState<ViewPatient | null>(null);

  const getPatients = async () => {
    try {
      setLoading(true);
      //  await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(
        `${apiUrl}/hospitals/${hospitalContext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patients`,
        {
          withCredentials: true,
          params: {
            pageSize: rowsPerPage,
            pageOffset: page-1,
            firstName: searchQueryName,
            lastName: searchQueryName,
            email: searchQueryEmail,
            phoneNumber: searchQueryPhone,
          },
        }
      );

      const { content, total } = response.data;
      setTotalItems(total);
      setActivePatients(content);
      console.log('Patient', response.data);

      const Patients = response.data.content;
      console.log(Patients);
      setActivePatients(Patients);
      setLoading(false);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
      setLoading(false);
    }
  };

  useEffect(() => {
    getPatients();
  }, [page, rowsPerPage, searchQueryName, searchQueryEmail, searchQueryPhone, hospitalContext?.hospital?.id,doctorcontext?.doctor?.id]);

  const handleFilterChange = () => {
    setPage(1);
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchQueryName, searchQueryEmail, searchQueryPhone]);

  //Patient Update CloseModal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };

  //Search Function
  const handleSearchNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQueryName(event.target.value);
    getPatients();
  };

  const handleSearchEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQueryEmail(event.target.value);
    getPatients();
  };

  const handleSearchPhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQueryPhone(event.target.value);
    getPatients();
  };

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

  //Table Row Select Function
  const handleRowClick = (
    patientId: number,
    event: React.MouseEvent<HTMLTableRowElement>
  ) => {
    const selectedPatient: ViewPatient | undefined = activePatients.find(
      (patient) => patient.id === patientId
    );

    if (selectedPatient) {
      setViewData(selectedPatient);
      setSelectedPatient(patientId);
    }
  };

  const openDeleteModal = (patientId: number) => {
    const selectedPatient: ViewPatient | undefined = activePatients.find(
      (patient) => patient.id === patientId
    );

    if (selectedPatient) {
      setPatientToDeleteId(patientId);
      setDeleteData(selectedPatient);
      setIsDeleteModalOpen(true);
    }
  };

  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setPatientToDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  //Pagination
  const handleChangePage = (event: any, newPage: number) => {
    console.log('Page changed to:', newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    const newRowsPerPage = parseInt(event.target.value);
    console.log('Rows per page changed to:', newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setRowsPerPage(newRowsPerPage);
    getPatients();
  };

  const pageCountThreshold = totalItems;

  const pageCount = Math.ceil(totalItems / rowsPerPage);

  // Add Patient
  const handleAddPatient = async (formData: Form) => {
    try {
      const { data: responseData } = await axios.post(
        `${apiUrl}/hospitals/${hospitalContext?.hospital?.id}/patients`,
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

  // Edit Patient
  const handleUpdate = async (updateData: EditForm) => {
    try {
      const response = await axios.put(
        `${apiUrl}/hospitals/${hospitalContext?.hospital?.id}/patients/${selectedPatientId}`,
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

  //delete a Patient

  const handleDelete = async (Id: any) => {
    try {
      const { data } = await axios.delete(
        `${apiUrl}/hospitals/${hospitalContext?.hospital?.id}/patients/${Id}`,
        {
          withCredentials: true,
        }
      );
      console.log(data);
      console.log('Patient DeActive successfully');
      enqueueSnackbar('Patient Deleted Successfully', { variant: 'success' });
      getPatients();
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
    }
  };

  //Select Particular Table Row Function
  // function handleRowClick(residentid: number, event: React.MouseEvent<HTMLTableRowElement>) {
  //   if (event.target instanceof HTMLElement && event.target.classList.contains('action-button')) {
  //     return;
  //   }
  //   setSelectedResident(residentid)
  // }

  const handleCheckboxChange = (PatientId: number) => {
    const isSelected = selectedItems.includes(PatientId);
    if (isSelected) {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== PatientId)
      );
    } else {
      setSelectedItems((prevSelected) => [...prevSelected, PatientId]);
    }
  };

  const handleHeaderCheckboxChange = () => {
    // If all items are currently selected, unselect all. Otherwise, select all.
    const allSelected = activePatients.every((patient) =>
      selectedItems.includes(patient.id)
    );

    if (allSelected) {
      setSelectedItems([]);
    } else {
      const allPatientIds = activePatients.map((patient) => patient.id);
      setSelectedItems(allPatientIds);
    }
  };

  // BreadCrumbs
  const breadcrumbs = [
    {
      to: `/hospitals/${hospitalContext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/dashboard`,
      label: `${hospitalContext?.hospital?.name}`,
    },
    {
      label: 'Patients',
    },
  ];

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  return (
    <Box className={styles['container']}>
      {/* <Breadcrumbs paths={breadcrumbs} /> */}
      <Box className={styles['building_container']}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop:'5px',
          }}
        >
          {/* <Box
            sx={{
              mt: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h1 style={{ marginTop: '10px' }}>Patients</h1>
            <TextField
              type="text"
              variant="outlined"
              size="small"
              sx={{ ml: '10px' }}
              onChange={handleSearchNameChange}
              InputProps={{
                startAdornment: <SearchIcon color="action" />,
              }}
            />
          </Box> */}
          {/* <Button
            variant="contained"
            color="primary"
            // onClick={() => {
            //   setIsAddModalOpen(true)
            // }}
            onClick={() => navigate(`/hospitals/${hospitalContext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patients/add`)}
          >
            {' '}
            <AddIcon fontSize="small" /> Add
          </Button> */}
        </Box>
        <Box>
          <AddPatientComponent
            open={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleAddPatient}
          />
        </Box>
        <Box>
          {/* <ViewPatientComponent
                open={viewPatientOpen}
                onClose={() => setViewPatientOpen(false)}
                patientId={selectedPatient}
                initialData={viewData}
              /> */}
        </Box>

        <TableContainer sx={{width:'100%'}}>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell>
                  <Checkbox
                    {...label}
                    checked={
                      activePatients.length > 0 &&
                      activePatients.every((building) =>
                        selectedItems.includes(building.id)
                      )
                    }
                    onChange={handleHeaderCheckboxChange}
                  />
                </TableCell> */}
                <TableCell sx={{ border: 'hidden' }}>Name</TableCell>
                <TableCell sx={{ border: 'hidden' }}>
                  Digital Health Code
                </TableCell>
                <TableCell sx={{ border: 'hidden' }}>Email</TableCell>
                <TableCell sx={{ border: 'hidden' }}>Phone Number</TableCell>
                <TableCell sx={{ border: 'hidden' }}>Gender</TableCell>
                <TableCell sx={{ border: 'hidden' }}>Blood Group</TableCell>
               
                <TableCell sx={{ border: 'hidden' }}>Address</TableCell>
                {/* <TableCell sx={{ border: 'hidden' }}>Actions</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow></TableRow>
              {loading ? (
                <TableCell align="center" colSpan={7}>
                  <CircularProgress size='small' />
                </TableCell>
              ) : Array.isArray(activePatients) && activePatients.length > 0 ? (
                activePatients.slice(0,5).map((patient: ViewPatient, index: number) => (
                  <TableRow
                    // className={styles['table_row']}
                    onClick={(e) => {
                      handleRowClick(patient.id, e);
                      setViewPatientOpen(true);
                    }}
                    key={index}
                  >
                    {/* <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(patient.id)}
                        onChange={() => handleCheckboxChange(patient.id)}
                        {...label}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    </TableCell> */}
                    <TableCell>
                    <NavLink
                      to={`/hospitals/${hospitalContext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patients/${patient.id}/patient-detail`}
                      className={styles['socname']}
                    >
                      {patient.firstName} {patient.lastName}
                      </NavLink>
                    </TableCell>
                    <TableCell>{patient.digitalHealthCode}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>+91-{patient.phoneNumber}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.bloodGroup}</TableCell>
                    <TableCell>
                      {patient.addressLine1} {patient.addressLine2} ,
                      {patient.city}, {patient.stateCode}, {patient.postalCode}
                    </TableCell>
                    {/* <TableCell align="center">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/hospitals/${hospitalContext?.hospital?.id}/doctors/${doctorcontext?.doctor?.id}/patients/${patient.id}/edit`
                          );
                        }}
                        sx={{ color: 'black' }}
                      >
                        <EditIcon></EditIcon>
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => openDeleteModal(patient.id)}
                      >
                        <DeleteIcon></DeleteIcon>
                      </IconButton>
                    </TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    sx={{
                      textAlign: 'center',
                    }}
                    colSpan={8}
                  >
                    No Patient found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          ></Box>
        </TableContainer>
        {/* <Stack spacing={2} className={styles['paginationContainer']}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handleChangePage}
            color="primary"
            renderItem={(item) => (
              <PaginationItem {...item} className={styles['paginationItem']} />
            )}
            siblingCount={1}
            boundaryCount={1}
            showFirstButton
            showLastButton
          />
        </Stack> */}
      </Box>

      {/* <EditPatientComponent
        open={isEditModalOpen}
        onClose={closeEditModal}
        onUpdate={(data) => {
          handleUpdate(data);
          closeEditModal();
        }}
        initialData={editData}
      />

      <DeletePatientComponent
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={() => {
          handleDelete(PatientToDeleteId);
          closeDeleteModal();
        }}
        patientData={deleteData}
      /> */}
    </Box>
  );
}

export default ListDashboardPatients;
