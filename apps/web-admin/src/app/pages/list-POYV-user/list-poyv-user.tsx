import axios from 'axios';
import styles from './list-poyv-user.module.scss';
import { environment } from '../../../environments/environment';
import { useCallback, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Autocomplete, TextField, Button, Modal, InputLabel, Checkbox, Box, CircularProgress, IconButton, Icon, Stack, Pagination, PaginationItem, Typography } from '@mui/material';
import Breadcrumbs from '../../Components/bread-crumbs/bread-crumbs';
import AddPOYVAdmin from './add-poyv-admin/add-poyv-admin';
import { enqueueSnackbar } from 'notistack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import EditPOYVAdmin from './edit-poyv-admin/edit-poyv-admin';
import DeletePOYVAdmin from './delete-poyv-admin/delete-poyv-admin';
import ViewPOYVUserComponent from './view-poyv-admin/view-poyv-admin';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import BlockIcon from '@mui/icons-material/Block';
import Loading from '../../Components/loading/loading';
import Chip from '../../Components/chip/chip';

interface POYVUser {
  id:number;
  superRole:string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  isActive:boolean;
  }


interface AddPOYVUser {
  superRole:string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

/* eslint-disable-next-line */
export interface ListPOYVUserProps {}

export function ListPOYVUser(props: ListPOYVUserProps) {
  const apiUrl = environment.apiUrl;
  const [poyvUserData, setPOYVUserData] = useState<POYVUser[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQueryName, setSearchQueryName] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedPOYVUserId, setSelectedPOYVUserId] = useState<number | null>(null);
  const [editData, setEditData] = useState<POYVUser | null>(null);
  const [deleteData, setDeleteData] = useState<POYVUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<{ id: number, isActive: boolean | undefined } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [poyvUserToDeactive, setPOYVUserToDeActive] = useState<{  isActive: boolean | undefined }>();
  const [viewPOYVUserOpen, setViewPOYVUserOpen] = useState(false);
  const [viewData, setViewData] = useState<POYVUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);

  const getAllPOYVUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/admins`, {
        withCredentials: true,
        params: {
          pageSize: rowsPerPage,
          pageOffset: page -1,
          name: searchQueryName,
        },
      });
      // console.log(response.data[0].user)
      const {content, total} = response.data;
      setPOYVUserData(response.data.content);
      setTotalItems(total)
      console.log("Admin Data",response.data.content);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      setLoading(false);
    }
  }, [apiUrl, rowsPerPage, page, searchQueryName]);
  
useEffect(() => {
 
  getAllPOYVUsers();
}, [apiUrl, getAllPOYVUsers, searchQueryName]);
  

const addPOYVUser = async (formData: AddPOYVUser) => {
  try {
     await setIsAddModalOpen(false);
    setIsLoadingModalOpen(true);
    const { data } = await axios.post(`${apiUrl}/admins`,
      formData,
      {
        withCredentials: true,
      })
    if (data) {
      getAllPOYVUsers();
      // setIsAddModalOpen(false);
      setIsLoadingModalOpen(false);
      enqueueSnackbar("User added successfully!", { variant: 'success' });
    } else {
      console.log("Something went wrong");
      setIsLoadingModalOpen(false);
    }
    console.log("User added successfully", data);
  } catch (error) {
    console.log("Something went wrong in input form", error);
    enqueueSnackbar("Something went wrong!", { variant: 'error' });
    setIsLoadingModalOpen(false);
  }
};

const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setSearchQueryName(event.target.value);
  getAllPOYVUsers();
};

const handleCheckboxChange = (UserId: number) => {
  const isSelected = selectedItems.includes(UserId);
  if (isSelected) {
    setSelectedItems((prevSelected) =>
      prevSelected.filter((id) => id !== UserId)
    );
  } else {
    setSelectedItems((prevSelected) => [...prevSelected, UserId]);
  }
};

const handleHeaderCheckboxChange = () => {
  const allSelected = poyvUserData.every((user) =>
    selectedItems.includes(user.id)
  );

  if (allSelected) {
    setSelectedItems([]);
  } else {
    const allUserIds = poyvUserData.map((user) => user.id);
    setSelectedItems(allUserIds);
  }
};


 //Table Row Select Function
 const handleRowClick = (POYVUserId: number, event: React.MouseEvent<HTMLTableRowElement>) => {
  const selectedPOYVUser: POYVUser | undefined = poyvUserData.find(
    (user) => user.id === POYVUserId
  );

  if (selectedPOYVUser) {
    setViewData(selectedPOYVUser)
    getAllPOYVUsers();
    setSelectedPOYVUserId(POYVUserId);
  }
};

 //POYVUser Update OpenModal
 const handleEditClick = (POYVUserId: number) => {
  const selectedPOYVUser: POYVUser | undefined = poyvUserData.find(
    (User) => User.id === POYVUserId
  );

  if (selectedPOYVUser) {
    setEditData(selectedPOYVUser)
    setSelectedPOYVUserId(POYVUserId);
    console.log(POYVUserId)
    setIsEditModalOpen(true);
  }
};

const openDeleteModal = (user: { id: number, isActive: boolean | undefined } | null) => {
  const selectedUser: POYVUser | undefined = poyvUserData.find(
    (Users) => Users.id === user?.id
  );

  if (selectedUser) {
  setDeleteData(selectedUser);
  setUserToDeleteId(user);
  setPOYVUserToDeActive({ isActive: user?.isActive });
  console.log("userToDeleteId:", userToDeleteId);
  setIsDeleteModalOpen(true);
  }
};

// Function to close the delete confirmation modal
const closeDeleteModal = () => {
  setUserToDeleteId(null);
  setIsDeleteModalOpen(false);
};

const closeEditModal = () => {
  setIsEditModalOpen(false);
  setEditData(null);
};

const handleChangePage = (event: any, newPage: number) => {
  console.log('Page changed to:', newPage);
  setPage(newPage);
};

const handleChangeRowsPerPage = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const newRowsPerPage = parseInt(event.target.value, 10);
  setRowsPerPage(newRowsPerPage);
  setPage(0);
};

const pageCountThreshold = totalItems;

const pageCount = Math.ceil(totalItems / rowsPerPage);

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


 // Edit POYV User
 const handleUpdate = async (formData: AddPOYVUser) => {
  try {
    console.log(editData);
    const response = await axios.put(
      `${apiUrl}/admins/${selectedPOYVUserId}`,
      formData,
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
      enqueueSnackbar("User updated successfully!", { variant: 'success' });
      // navigate(`/buildinglist/${params.id}`);
      getAllPOYVUsers();
      setIsModalOpen(false)
    } else {
      console.log('Update data not received');
      enqueueSnackbar("Error in Updation !", { variant: 'error' });
    }

  } catch (error) {
    console.error(error);
    console.log('Something went wrong');
    enqueueSnackbar("Something went wrong", { variant: 'error' });
  }
};


  //delete a POYV User

  const handleDelete = async (user: { id: number, isActive: boolean | undefined } | null) => {
    try {
      setIsLoadingModalOpen(true);
      const { data } = await axios.put(`${apiUrl}/users/${user?.id}/status`, {isActive: !user?.isActive},{
        withCredentials: true,
      });
      console.log(data);
      console.log('User DeActive successfully');
      setIsLoadingModalOpen(false);
      enqueueSnackbar(`User ${poyvUserToDeactive?.isActive===false ? 'activated': 'deactivated'} successfully!`, { variant: 'success' });
      getAllPOYVUsers();
    } catch (error) {
      console.log(error);
      console.log("Something went wrong");
      setIsLoadingModalOpen(false);
      enqueueSnackbar("Error in Deletion!", { variant: 'error' });
    }
  }

  function formatSuperRoleType(type: string) {
    switch (type) {
        case 'ADMIN':
            return 'Admin';
        case 'USER':
            return 'User';
        default:
            return type; 
    }
}

const breadcrumbs = [
 
  {
    label: 'Users',
  },
];

  return (
    <Box className={styles['container']}>
        <Breadcrumbs paths={breadcrumbs} />
        <Box className={styles['building_container']}>
          <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}} >
           <Box sx={{mt:'20px',display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h1 style={{marginTop:'10px'}}>Users</h1>
            <TextField
                sx={{ ml: '10px' }}
                type="text"
                variant="outlined"
                size="small"
                onChange={handleSearchNameChange}
                InputProps={{
                  startAdornment: (
                    <SearchIcon color="action" />
                  ),
                }}
              />
              </Box>
            <Box>
              <AddPOYVAdmin
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={addPOYVUser}
              />
                <Loading open={isLoadingModalOpen}
                    onClose={() => setIsLoadingModalOpen(false)} />
            </Box>
            <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}} className={styles['search-container']}>
              
              <Button variant="contained" color="primary" 
                onClick={() => {
                  setIsAddModalOpen(true);
                }}
              > <AddIcon fontSize='small' />Add</Button>
            </Box>

          </Box >
          <TableContainer >
            <Table  stickyHeader>
              <TableHead>
              <TableRow>
                <TableCell><Checkbox
                  {...label}
                  checked={
                    poyvUserData.length > 0 &&
                    poyvUserData.every((user) =>
                      selectedItems.includes(user.id)
                    )
                  }
                  onChange={handleHeaderCheckboxChange}
                /></TableCell>
                  <TableCell sx={{ border: "hidden" }}>Name
                  </TableCell>
                  <TableCell sx={{ border: "hidden" }}>Email
                  </TableCell>
                  {/* <TableCell sx={{ border: "hidden", fontFamily: "Poppins" }}>Role
                  </TableCell> */}
                  <TableCell sx={{ border: "hidden" }}>Status</TableCell>
                  <TableCell sx={{ border: "hidden" }}>Actions</TableCell>
                </TableRow>

              </TableHead>
              <TableBody>
                <TableRow
                //    sx={{
                //   position:"sticky",
                //   top: 56,
                //   backgroundColor:"white",
                // }}
                >
                </TableRow>
                {loading ? (
                <TableCell align='center' colSpan={6}>
                  <CircularProgress />
                </TableCell>
              ) : (Array.isArray(poyvUserData) && poyvUserData.length > 0 ? (
                  poyvUserData.map((poyvUser: POYVUser) => (
                    <TableRow className={styles['table-row']} onClick={(e) => {handleRowClick(poyvUser.id, e); setViewPOYVUserOpen(true); }}>
                      <TableCell><Checkbox
                      checked={selectedItems.includes(poyvUser.id)}
                      onChange={() => handleCheckboxChange(poyvUser.id)}
                      {...label}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                    </TableCell >
                    <TableCell >
                       <b> {poyvUser.firstName} {poyvUser.lastName}</b> 
                        <br />
                        {formatSuperRoleType(poyvUser.superRole)}
                      </TableCell>
                      <TableCell>
                        {poyvUser.email}
                      </TableCell>
                      {/* <TableCell>
                      {formatSuperRoleType(poyvUser.superRole)}
                      </TableCell> */}
                      <TableCell >
                        {/* <Box className={`${styles.socname} ${poyvUser?.isActive ? styles.active : styles.inactive}`}>{poyvUser?.isActive ? (
                          'Active'
                        ) : (
                          "InActive"
                        )}</Box> */}
                        <Typography>
                        {poyvUser.isActive ? (
                          <Chip label="Success">Active</Chip>
                        ) : (
                          <Chip label="Error">Inactive</Chip>
                        )}
                      </Typography>
                      </TableCell>
                      <TableCell >
                        <IconButton classes="btn btn-primary action-button" sx={{color:'black'}} onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(poyvUser.id);
                        }}>
                        <EditIcon color="primary">
                          Edit
                        </EditIcon>
                        </IconButton>
                        
                        {/* <DeleteIcon sx={{ ml: 1 }} classes="btn btn-danger action-button" color="error" className={styles['row-action-button']} onClick={(e) => {
                          // handleDelete(building.id)
                          e.stopPropagation();
                          openDeleteModal({ id: poyvUser.id, isActive: poyvUser.isActive })
                        }}>
                          Delete
                        </DeleteIcon> */}
                         {poyvUser.isActive ? (
                          <IconButton classes="btn btn-danger action-button" color="error"  onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal({ id: poyvUser.id, isActive: poyvUser.isActive })
                          }}>
                            <BlockIcon>
                              Delete
                            </BlockIcon>
                          </IconButton>
                          
                        ) : (
                          <IconButton classes="btn btn-danger action-button"   onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal({ id: poyvUser.id, isActive: poyvUser.isActive })
                          }}>
                            <RadioButtonCheckedIcon className={styles['row-action-delete-button']}>
                              Delete
                            </RadioButtonCheckedIcon>
                          </IconButton>
                          
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align='center' colSpan={7}>No User found</TableCell>
                  </TableRow>
                 )
                 )}
              </TableBody>
            </Table>
            {/* <Box sx={{  display:'flex',
            flexDirection:'row',
            justifyContent:"flex-end",
           
          }}> */}
          {/* <Stack sx={{marginBottom:"15px", marginRight:"20px", marginTop: "30px",}} spacing={2}>
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
              {/* </Box> */}
           </TableContainer>
            {/* <Pagination
              // rowsPerPageOptions={[5, 10, 20]}
              // component="div"
              // count={totalItems}
              count={rowsPerPage}
              // rowsPerPage={rowsPerPage}
              // page={page}
              // onPageChange={handleChangePage}
              // onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}

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
         

        </Box >
         
        <ViewPOYVUserComponent
                open={viewPOYVUserOpen}
                onClose={() => setViewPOYVUserOpen(false)}
                initialData={viewData}
              />

        <EditPOYVAdmin
          open={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={(data) => {
            handleUpdate(data);
            closeEditModal();
          }}
          initialData={editData}
        />

        <DeletePOYVAdmin
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={() => {
            handleDelete(userToDeleteId);
            closeDeleteModal();
          }}
          Status={poyvUserToDeactive?.isActive}
          userData={deleteData}
        />
      </Box >
  );
}

export default ListPOYVUser;
