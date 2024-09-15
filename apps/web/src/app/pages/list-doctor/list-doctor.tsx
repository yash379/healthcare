/* eslint-disable react/jsx-no-useless-fragment */
import styles from './list-doctor.module.scss';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, Button, Checkbox, CircularProgress, IconButton, Stack, Pagination, PaginationItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import Breadcrumbs from '../../Components/bread-crumbs/bread-crumbs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddDoctorComponent from './add-doctor/add-doctor';
import EditDoctorComponent from './edit-doctor/edit-doctor';
import DeleteDoctorComponent from './delete-doctor/delete-doctor';
// import ViewDoctorComponent from '../view-doctor/view-doctor';
import { enqueueSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { Doctor, Hospital, ViewDoctor } from '@healthcare/data-transfer-types';
import AddIcon from '@mui/icons-material/Add';
import { HospitalContext } from '../../contexts/hospital-context';
import { Gender } from '@prisma/client';
import Loading from '../../Components/loading/loading';

/* eslint-disable-next-line */
export interface ListDoctorsProps { }


interface Form {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  phoneNumber: string;
  doctorCode: string;
  speciality: string;
  isActive: boolean,
}

export interface EditForm {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  phoneNumber: string;
  doctorCode: string;
  speciality: string;
  isActive: boolean;
}



export function ListDoctors(props: ListDoctorsProps) {
  const apiUrl = environment.apiUrl;
  const [activeDoctors, setActiveDoctors] = useState<ViewDoctor[]>([]);
  const [viewDoctorOpen, setViewDoctorOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQueryName, setSearchQueryName] = useState<string>('');
  const [searchQueryEmail, setSearchQueryEmail] = useState<string>('');
  const [searchQueryPhone, setSearchQueryPhone] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [DoctorToDeleteId, setDoctorToDeleteId] = useState<number | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [editData, setEditData] = useState<ViewDoctor | null>(null);
  const [viewData, setViewData] = useState<ViewDoctor | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  console.log("hospital id:", id);
  const params = useParams();
  const hospitalContext = useContext(HospitalContext);
  console.log("Hospital Context:", hospitalContext);
  console.log("hospital context hospital id:", hospitalContext?.hospital?.id);

  const getDoctors = async () => {
    try {
      setLoading(true);
      //  await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(`${apiUrl}/hospitals/${params.hospitalId}/doctors`, {
        withCredentials: true,
        params: {
          pageSize: rowsPerPage,
          pageOffset: page,
          name: searchQueryName,
          // lastName: searchQueryName,
          // email: searchQueryEmail,
          // phoneNumber: searchQueryPhone
        },
      });

      const { content, total } = response.data;
      setTotalItems(total);
      setActiveDoctors(content);
      console.log("Doctor", response.data)

      const Doctors = response.data.content;
      console.log(Doctors)
      setActiveDoctors(Doctors);
      setLoading(false);
    } catch (error) {
      console.log(error);
      console.log("Something went wrong");
      setLoading(false);
    }
  };


  useEffect(() => {
    getDoctors();
  }, [page, rowsPerPage, searchQueryName])


  const handleFilterChange = () => {
    setPage(0);
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchQueryName]);





  //Doctor Update CloseModal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };


  //Search Function
  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryName(event.target.value);
    getDoctors();
  };

  const handleSearchEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryEmail(event.target.value);
    getDoctors();
  };

  const handleSearchPhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryPhone(event.target.value);
    getDoctors();
  };


  //Building Update Function
  const handleEditClick = (doctorId: number) => {
    const selectedDoctor: ViewDoctor | undefined = activeDoctors.find(
      (doctor) => doctor.id === doctorId
    );

    if (selectedDoctor) {
      setEditData(selectedDoctor)
      setSelectedDoctorId(doctorId);
      setIsEditModalOpen(true);
    }
  };

  //Table Row Select Function
  const handleRowClick = (doctorId: number, event: React.MouseEvent<HTMLTableRowElement>) => {
    const selectedDoctor: ViewDoctor | undefined = activeDoctors.find(
      (doctor) => doctor.id === doctorId
    );

    if (selectedDoctor) {
      setViewData(selectedDoctor)
      setSelectedDoctor(doctorId);
    }
  };


  // Function to open the delete confirmation modal
  const openDeleteModal = (doctorId: number) => {
    setIsDeleteModalOpen(true);
  };

  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setDoctorToDeleteId(null);
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
    getDoctors();
  };


  const pageCountThreshold = totalItems;

  const pageCount = Math.ceil(totalItems / rowsPerPage);

  // Add Doctor
  const handleAddDoctor = async (formData: Form) => {

    try {
      await setIsAddModalOpen(false);
    setIsLoadingModalOpen(true);

      const { data: responseData } = await axios.post(`${apiUrl}/hospitals/${params.hospitalId}/doctor`,
        { firstName: formData.firstName, lastName: formData.lastName, gender: formData.gender, email: formData.email, phoneNumber: '8734234232', doctorCode: formData.doctorCode, speciality: formData.speciality, isActive: formData.isActive },
        {
          withCredentials: true,

        },)
      if (responseData) {
        setIsLoadingModalOpen(false);
        enqueueSnackbar('Doctor added successfully', { variant: 'success' });
        setIsAddModalOpen(false);
        getDoctors();

      } else {
        console.log("Something went wrong");
        setIsLoadingModalOpen(false);
      }
      console.log("User added successfully", responseData);

    } catch (error) {
      console.log(error);
      console.log("Something went wrong in input form")
      enqueueSnackbar('Something went wrong', { variant: 'error' });
      setIsLoadingModalOpen(false);
    }
  }



  // Edit Doctor
  const handleUpdate = async (updateData: ViewDoctor) => {
    console.log(updateData, "updatedData");
    try {
      const response = await axios.put(
        `${apiUrl}/hospitals/${params.hospitalId}/doctor/${selectedDoctorId}`,
        {
          firstName: updateData.firstName, lastName: updateData.lastName, email: updateData.email, phoneNumber: '9834235433',
          gender: updateData.gender, doctorCode: updateData.doctorCode, speciality: updateData.speciality, isActive: true
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
        enqueueSnackbar('Doctor details updated successfully', { variant: 'success' });
        getDoctors();
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

  //delete a Doctor

  const handleDelete = async (Id: any) => {
    try {
      const { data } = await axios.post(`${apiUrl}/hospitals/${hospitalContext?.hospital?.id}/doctors/${Id}`, {
        withCredentials: true,
      });
      console.log(data);
      console.log('Doctor DeActive successfully')
      enqueueSnackbar('Doctor Deleted Successfully', { variant: 'success' });
      getDoctors();
    } catch (error) {
      console.log(error)
      console.log("Something went wrong")
    }
  }


  //Select Particular Table Row Function
  // function handleRowClick(residentid: number, event: React.MouseEvent<HTMLTableRowElement>) {
  //   if (event.target instanceof HTMLElement && event.target.classList.contains('action-button')) {
  //     return;
  //   }
  //   setSelectedResident(residentid)
  // }

  const handleCheckboxChange = (DoctorId: number) => {
    const isSelected = selectedItems.includes(DoctorId);
    if (isSelected) {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== DoctorId)
      );
    } else {
      setSelectedItems((prevSelected) => [...prevSelected, DoctorId]);
    }
  };

  const handleHeaderCheckboxChange = () => {
    // If all items are currently selected, unselect all. Otherwise, select all.
    const allSelected = activeDoctors.every((doctor) =>
      selectedItems.includes(doctor.id)
    );

    if (allSelected) {
      setSelectedItems([]);
    } else {
      const allDoctorIds = activeDoctors.map((doctor) => doctor.id);
      setSelectedItems(allDoctorIds);
    }
  };


  // BreadCrumbs
  const breadcrumbs = [
    {
      to: '/hospitals',
      label: 'Hospitals',
    },
    {
      to: `/hospitals/${hospitalContext?.hospital?.id}`,
      label: `${hospitalContext?.hospital?.name}`
    },
    {
      label: 'Doctors',
    },
  ];

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


  return (
      <Box className={styles['container']}>
        {/* <Breadcrumbs paths={breadcrumbs} /> */}
        <Box className={styles['building_container']}>
          <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}} >
           <Box sx={{mt:'20px',display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h1 style={{marginTop:'10px'}}>Doctors</h1>
            <TextField
                type="text"
                variant="outlined"
                size="small"
                sx={{ml: '10px' }}
                onChange={handleSearchNameChange}
                InputProps={{
                  startAdornment: (
                    <SearchIcon color="action" />
                  ),
                }}
              />
                </Box>
            <Box>
              <AddDoctorComponent
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddDoctor}
              />
               <Loading open={isLoadingModalOpen}
                    onClose={() => setIsLoadingModalOpen(false)} />
            </Box>
            {/* <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}} className={styles['search-container']}>

              <Button variant="contained" color="primary"
                onClick={() => {
                  setIsAddModalOpen(true);
                }}
              > <AddIcon fontSize='small' />Add</Button>
            </Box> */}
            {/* <Box> */}
              {/* <ViewDoctorComponent
                open={viewDoctorOpen}
                onClose={() => setViewDoctorOpen(false)}
                doctorId={selectedDoctor}
                initialData={viewData}
              /> */}
            {/* </Box> */}
            {/* <Box className={styles['search-container']}>

              <Button variant="contained" color="primary"
                onClick={() => {
                  setIsAddModalOpen(true)
                }}
              > <AddIcon fontSize='small' /> Add</Button>
            </Box> */}

          </Box >

          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><Checkbox
                    {...label}
                    checked={
                      activeDoctors.length > 0 &&
                      activeDoctors.every((building) =>
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
                  <TableCell sx={{ border: "hidden" }}>Doctor Code
                  </TableCell>
                  <TableCell sx={{ border: "hidden" }}>Speciality
                  </TableCell>
                  {/* <TableCell sx={{ border: "hidden" }}>Flat Number</TableCell>
                  <TableCell sx={{ border: "hidden" }}>Building Name</TableCell> */}
                  <TableCell sx={{ border: "hidden" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                </TableRow>
                {loading ? (
                  <TableCell align='center' colSpan={7}>
                    <CircularProgress />
                  </TableCell>
                ) : (Array.isArray(activeDoctors) && activeDoctors.length > 0 ? (
                  activeDoctors.map((doctor: ViewDoctor, index: number) => (
                    <TableRow className={styles['table_row']} onClick={(e) => { handleRowClick(doctor.id, e); setViewDoctorOpen(true); }} key={index}>
                      <TableCell><Checkbox
                        checked={selectedItems.includes(doctor.id)}
                        onChange={() => handleCheckboxChange(doctor.id)}
                        {...label}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      /></TableCell>
                      <TableCell>{doctor.firstName} {doctor.lastName}
                      </TableCell>
                      <TableCell>{doctor.email}
                      </TableCell>
                      <TableCell>{doctor.phoneNumber}
                      </TableCell>
                      <TableCell>
                        {doctor.gender}
                      </TableCell>
                      <TableCell>
                        {doctor.doctorCode}
                      </TableCell>
                      <TableCell>
                        {doctor.speciality}
                      </TableCell>
                      <TableCell align='center'>
                        {/* <IconButton onClick={(e) => { e.stopPropagation(); handleEditClick(doctor.id) }} sx={{ color: 'black' }}>
                          <EditIcon color="primary" ></EditIcon>
                        </IconButton>
                        <IconButton color="error" onClick={() =>
                          openDeleteModal(doctor.id)
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
                    }} colSpan={8}>No Doctor found</TableCell>
                  </TableRow>
                )
                )}
              </TableBody>
            </Table>
            {/* <Box sx={{  display:'flex',
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
          </Stack> */}
            {/* <TablePagination
              sx={{ marginTop: "5px" }}
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={totalItems}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
            {/* </Box> */}
          </TableContainer>
          <Stack spacing={2} className={styles['paginationContainer']}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handleChangePage}
            color="primary"
            renderItem={(item) => (
              <PaginationItem
                {...item}
                className={styles['paginationItem']}
              />
            )}
            siblingCount={1}
            boundaryCount={1}
            showFirstButton
            showLastButton
          />
        </Stack>

        </Box>


        <EditDoctorComponent
          open={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={(data) => {
            handleUpdate(data);
            closeEditModal();
          }}
          initialData={editData}
        />

        <DeleteDoctorComponent
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={() => {
            handleDelete(DoctorToDeleteId);
            closeDeleteModal();
          }}
          doctorData={viewData}
        />
      </Box >
  );
}

export default ListDoctors;
