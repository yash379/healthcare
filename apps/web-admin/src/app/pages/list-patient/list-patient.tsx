/* eslint-disable react/jsx-no-useless-fragment */
import styles from './list-patient.module.scss';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, Button, Checkbox, CircularProgress, IconButton, Stack, Pagination, PaginationItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import Breadcrumbs from '../../Components/bread-crumbs/bread-crumbs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPatientComponent from './add-patient/add-patient';
import EditPatientComponent from './edit-patient/edit-patient';
import DeletePatientComponent from './delete-patient/delete-patient';
// import ViewPatientComponent from '../view-patient/view-patient';
import { enqueueSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { Hospital } from '@healthcare/data-transfer-types';
import AddIcon from '@mui/icons-material/Add';
import { HospitalContext } from '../../contexts/user-contexts';
import { Gender } from '@prisma/client';

/* eslint-disable-next-line */
export interface ListPatientsProps { }


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

interface ViewPatient {
  id: number;
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



export function ListPatients(props: ListPatientsProps) {
  const apiUrl = environment.apiUrl;
  const [activePatients, setActivePatients] = useState<ViewPatient[]>([]);
  const [viewPatientOpen, setViewPatientOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQueryName, setSearchQueryName] = useState<string>('');
  const [searchQueryEmail, setSearchQueryEmail] = useState<string>('');
  const [searchQueryPhone, setSearchQueryPhone] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [PatientToDeleteId, setPatientToDeleteId] = useState<number | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [editData, setEditData] = useState<ViewPatient | null>(null);
  const [viewData, setViewData] = useState<ViewPatient | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [hospital,setHospital]=useState<Hospital | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams<{ id: string }>();
  console.log("hospital id:",id);
  const params=useParams();
  const hospitalContext=useContext(HospitalContext);
  console.log("Hospital Context:",hospitalContext);
  console.log("hospital context hospital id:",hospitalContext?.id);

  const getPatients = async () => {
    try {
      setLoading(true);
      //  await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(`${apiUrl}/hospitals/${params.hospitalId}/patients`, {
        withCredentials: true,
        params: {
          pageSize: rowsPerPage,
          pageOffset: page,
          firstName: searchQueryName,
          lastName: searchQueryName,
          email: searchQueryEmail,
          phoneNumber: searchQueryPhone
        },
      });

      const { content, total } = response.data;
      setTotalItems(total);
      setActivePatients(content);
console.log("Patient", response.data)

      const Patients = response.data.content;
      console.log(Patients)
      setActivePatients(Patients);
      setLoading(false);
    } catch (error) {
      console.log(error);
      console.log("Something went wrong");
      setLoading(false);
    }
  };


  useEffect(() => {
    getPatients();
  }, [page, rowsPerPage, searchQueryName,
    searchQueryEmail,
    searchQueryPhone])


  const handleFilterChange = () => {
    setPage(0);
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchQueryName,
    searchQueryEmail,
    searchQueryPhone]);





  //Patient Update CloseModal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };


  //Search Function
  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryName(event.target.value);
    getPatients()
  };

  const handleSearchEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryEmail(event.target.value);
    getPatients();
  };

  const handleSearchPhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryPhone(event.target.value);
    getPatients();
  };


  //Building Update Function
  const handleEditClick = (patientId: number) => {
    const selectedPatient: ViewPatient | undefined = activePatients.find(
      (patient) => patient.id === patientId
    );

    if (selectedPatient) {
      setEditData(selectedPatient)
      setSelectedPatientId(patientId);
      setIsEditModalOpen(true);
    }
  };

  //Table Row Select Function
  const handleRowClick = (patientId: number, event: React.MouseEvent<HTMLTableRowElement>) => {
    const selectedPatient: ViewPatient | undefined = activePatients.find(
      (patient) => patient.id === patientId
    );

    if (selectedPatient) {
      setViewData(selectedPatient)
      setSelectedPatient(patientId);
    }
  };


  // Function to open the delete confirmation modal
  const openDeleteModal = (patientId: number) => {
    setPatientToDeleteId(patientId);
    setIsDeleteModalOpen(true);
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
    setRowsPerPage(newRowsPerPage)
    getPatients();
  };


  const pageCountThreshold = totalItems;

  const pageCount = Math.ceil(totalItems / rowsPerPage);

  // Add Patient
  const handleAddPatient = async (formData: Form) => {

    try {
      const { data: responseData } = await axios.post(`${apiUrl}/hospitals/${params.hospitalId}/patients`,
        { firstName: formData.firstName, lastName: formData.lastName, gender: formData.gender,  email: formData.email, phoneNumber: formData.phoneNumber , bloodgroup: formData.bloodgroup, dob:formData.dob, digitalHealthCode:formData.digitalHealthCode, addressLine1:formData.addressLine1, addressLine2:formData.addressLine2, city:formData.city, stateCode:formData.stateCode, countryCode:formData.countryCode, postalCode:formData.postalCode, isActive: formData.isActive },
        {
          withCredentials: true,

        },)
      if (responseData) {
        enqueueSnackbar('Patient added successfully', { variant: 'success' });
        setIsAddModalOpen(false);
        getPatients();

      } else {
        console.log("Something went wrong")
      }

    } catch (error) {
      console.log(error);
      console.log("Something went wrong in input form")
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  }



  // Edit Patient
  const handleUpdate = async (updateData: EditForm) => {
    try {
      const response = await axios.put(
        `${apiUrl}/hospitals/${params.hospitalId}/patients/${selectedPatientId}`,
        {
          firstName: updateData.firstName, lastName: updateData.lastName, email: updateData.email, phoneNumber: updateData.phoneNumber,
          gender: updateData.gender, bloodgroup: updateData.bloodgroup, dob:updateData.dob, digitalHealthCode:updateData.digitalHealthCode, addressLine1:updateData.addressLine1, addressLine2:updateData.addressLine2, city:updateData.city, stateCode:updateData.stateCode, countryCode:updateData.countryCode, postalCode:updateData.postalCode, isActive: updateData.isActive
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        },

      );

      console.log(response.data);

      if (response.data) {
        console.log('Building Name Updated Successfully');
        enqueueSnackbar('Patient details updated successfully', { variant: 'success' });
        getPatients();
        setIsModalOpen(false)
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

  // const handleDelete = async (Id: any) => {
  //   try {
  //     const { data } = await axios.post(`${apiUrl}/societies/1/residents/${Id}/false`, null, {
  //       withCredentials: true,
  //     });
  //     console.log(data);
  //     console.log('Resident DeActive successfully')
  //     enqueueSnackbar('Resident Deleted Successfully', { variant: 'success' });
  //     getResidents();
  //   } catch (error) {
  //     console.log(error)
  //     console.log("Something went wrong")
  //   }
  // }


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
      to: '/hospitals',
      label: 'Hospitals',
    },
    {
      to: `/hospitals/${hospitalContext?.id}`,
      label: `${hospitalContext?.name}`
    },
    {
      label: 'Patients',
    },
  ];

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


  return (
    <>
      <Box className={styles['container']}>
        <Breadcrumbs paths={breadcrumbs} />
        <Box className={styles['building_container']}>

          <Box className={styles['btn_container']}>
            <h1>Patients</h1>
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
            <Box className={styles['search-container']}>
              <TextField
                type="text"
                variant="outlined"
                size="small"
                sx={{ mt: 2.3, mr: '10px' }}
                onChange={handleSearchNameChange}
                InputProps={{
                  startAdornment: (
                    <SearchIcon color="action" />
                  ),
                }}
              />
              <Button variant="contained" color="primary"
                onClick={() => {
                  setIsAddModalOpen(true)
                }}
              > <AddIcon fontSize='small' /> Add</Button>
            </Box>

          </Box >

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                <TableCell><Checkbox
                  {...label}
                  checked={
                    activePatients.length > 0 &&
                    activePatients.every((building) =>
                      selectedItems.includes(building.id)
                    )
                  }
                  onChange={handleHeaderCheckboxChange}
                /></TableCell>
                  <TableCell sx={{ border: "hidden" }}>Name
                  </TableCell>
                  <TableCell sx={{ border: "hidden" }}>Email
                  </TableCell>
                  <TableCell sx={{ border: "hidden" }}>Phone Number
                  </TableCell>
                  <TableCell sx={{ border: "hidden" }}>Gender
                  </TableCell>
                  <TableCell sx={{ border: "hidden" }}>Blood Group
                  </TableCell>
                  <TableCell sx={{ border: "hidden" }}>Digital Health Code
                  </TableCell>
                  <TableCell sx={{ border: "hidden" }}>Address
                  </TableCell>
                  {/* <TableCell sx={{ border: "hidden" }}>Flat Number</TableCell>
                  <TableCell sx={{ border: "hidden" }}>Building Name</TableCell> */}
                  <TableCell sx={{ border: "hidden" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                </TableRow>
                {loading ? (
                <TableCell align='center' colSpan={7}>
                  <CircularProgress />
                </TableCell>
              ) : (Array.isArray(activePatients) && activePatients.length > 0 ? (
                  activePatients.map((patient: ViewPatient, index: number) => (
                    <TableRow className={styles['table_row']} onClick={(e) => { handleRowClick(patient.id, e); setViewPatientOpen(true); }} key={index}>
                       <TableCell><Checkbox
                      checked={selectedItems.includes(patient.id)}
                      onChange={() => handleCheckboxChange(patient.id)}
                      {...label}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    /></TableCell>
                      <TableCell>{patient.firstName} {patient.lastName}
                      </TableCell>
                      <TableCell>{patient.email}
                      </TableCell>
                      <TableCell>+91-{patient.phoneNumber}
                      </TableCell>
                      <TableCell>
                        {patient.gender}
                      </TableCell>
                      <TableCell>
                        {patient.bloodgroup}
                      </TableCell>
                      <TableCell>
                        {patient.digitalHealthCode}
                      </TableCell>
                      <TableCell>
                        {patient.addressLine1} {patient.addressLine2} ,{patient.city}, {patient.stateCode}, {patient.postalCode}
                      </TableCell>
                      <TableCell align='center'>
                      <IconButton onClick={(e) => { e.stopPropagation(); handleEditClick(patient.id) }} sx={{ color:'black'}}>
                        <EditIcon ></EditIcon>
                      </IconButton>
                      {/* <IconButton color="error"  onClick={() =>
                      openDeleteModal(resident.id)
                      }>
                        <DeleteIcon></DeleteIcon>
                      </IconButton> */}

                        
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell sx={{
                      textAlign: 'center',
                    }} colSpan={8}>No Patient found</TableCell>
                  </TableRow>
                  )
                  )}
              </TableBody>
            </Table>
            <Box sx={{  display:'flex',
            flexDirection:'row',
            justifyContent:"flex-end",
           
          }}>
          <Stack sx={{marginBottom:"15px", marginRight:"20px", marginTop: "30px",}} spacing={2}>
            <Pagination
            sx={{  display:'flex',
            flexDirection:'row',
            justifyContent:"flex-end",
           
          }}
              count={pageCount > pageCountThreshold ? pageCount + 1 : pageCount}
              page={page + 1}
              onChange={(event, value) => handleChangePage(event, value - 1)}

              renderItem={(item) => (
                <PaginationItem
                  component="div"
                  sx={{
                 
                    marginLeft: "5px",
                  
                  }}
                 
                  {...item}
                />
              )}
            />
          </Stack>
            <TablePagination
              sx={{ marginTop: "5px" }}
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={totalItems}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </Box>
          </TableContainer>
        </Box>


        <EditPatientComponent
          open={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={(data) => {
            handleUpdate(data);
            closeEditModal();
          }}
          initialData={editData}
        />

        {/* <DeletePatientComponent
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={() => {
            handleDelete(PatientToDeleteId);
            closeDeleteModal();
          }}
        /> */}
      </Box >

    </>
  );
}

export default ListPatients;
