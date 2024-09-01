import styles from './view-hospital-page.module.scss';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Paper, Grid, Box, Button, Divider,  IconButton, CircularProgress, Card, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Breadcrumbs from '../../../Components/bread-crumbs/bread-crumbs';
import { environment } from '../../../../environments/environment';
import AddIcon from '@mui/icons-material/Add';
import AddAdmin from './add-admin/add-admin';
import { enqueueSnackbar } from 'notistack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditAdmin from './edit-admin/edit-admin';
import DeleteAdmin from './delete-admin/delete-admin';
import { HospitalContext } from '../../../contexts/user-contexts';
import Loading from '../../../Components/loading/loading';
import { CountriesStates } from '../../../core/consts/countries-states';
import Chip from '../../../Components/chip/chip';

interface Form {
  id: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}
interface AddForm {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}
interface Manager {
  id:number;
  isPrimary:boolean;
  hospitalRole:{
    name:string;
  },
  user:{
  id:number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  }
}

/* eslint-disable-next-line */
export interface ViewHospitalPageProps { }

export function ViewHospitalPage(props: ViewHospitalPageProps) {
  const { id } = useParams<{ id: string }>();
  const apiUrl = environment.apiUrl;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDeleteId, setAdminToDeleteId] = useState<{ id: number } | null>(null);
  const [editData, setEditData] = useState<Manager | null>(null);
  const [deleteData, setDeleteData] = useState<Manager | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminData, setAdminData] = useState<Manager[]>([]);
  const [loadingHospitalInfo, setLoadingHospitalInfo] = useState(true);
  const [loadingAllAdmin, setLoadingAllAdmin] = useState(true);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [countryName, setCountryName] = useState('');
  const [stateName, setStateName] = useState('');

  const [hospitalData, setHospitalData] = useState({
    id:'',
    name: '',
    email: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateCode: '',
    countryCode: '',
    postalCode: '',
    code: '',
  });


  const { hospitalId } = useParams<{ hospitalId: string }>();
  console.log("hospital id:",hospitalId);

  const hospitalContext=useContext(HospitalContext);
  console.log("Hospital context:",hospitalContext); 

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        setLoadingHospitalInfo(true);
              //  await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await axios.get(`${apiUrl}/hospitals/${hospitalId}`,
        {
          withCredentials: true,

        });
        console.log(response.data)
        setHospitalData(response.data);
        console.log(response.data);
        setLoadingHospitalInfo(false);
        const country =
        CountriesStates.find(
          (country) => country.code === response.data.countryCode
        )?.name || '';
      const state =
        CountriesStates.find(
          (country) => country.code === response.data.countryCode
        )?.states.find((state) => state.code === response.data.stateCode)
          ?.name || '';
      setCountryName(country);
      setStateName(state);
      } catch (error) {
        console.error('Error fetching hospital data:', error);
        setLoadingHospitalInfo(false);
      }
    };

    fetchHospitalData();
  }, [apiUrl, hospitalId]);


  const getAllAdmin = async () => {
    try {
      setLoadingAllAdmin(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(`${apiUrl}/hospitals/${hospitalId}/managers`, {
        withCredentials: true,});
      // console.log(response.data[0].user)
      const sortedResidents = response.data.sort((a:any, b:any) => {
        if (a.isPrimary && !b.isPrimary) {
          return -1;
        }
        else if (!a.isPrimary && b.isPrimary) {
          return 1;
        }
        else {
          return 0;
        }
      });
      setAdminData(sortedResidents);
      console.log("Admin Data",response.data);
      setLoadingAllAdmin(false);
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      setLoadingAllAdmin(false);
    }
  };


  useEffect(() => {
    getAllAdmin();
  }, [id]);

  const breadcrumbs = [
    {
      to: '/hospitals',
      label: 'Hospital',
    },
    {
      // to:`/hospitals/:id`
      label: `${hospitalData?.name}`
    },
  ];

  // Function to open the delete confirmation modal
  const openDeleteModal = (Admin: { id: number } | null) => {
    const selectedAdmin: Manager | undefined = adminData.find(
      (Admins) => Admins.user.id === Admin?.id
    );

    if (selectedAdmin) {
      setDeleteData(selectedAdmin);
    setAdminToDeleteId(Admin);
    console.log("AdminToDeleteId:", adminToDeleteId);
    setIsDeleteModalOpen(true);
    }
  };

  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setAdminToDeleteId(null);
    setIsDeleteModalOpen(false);
  };


  // Function to close the edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };


  const handleEditClick = (AdminId: number) => {
    const selectedAdmin: Manager | undefined = adminData.find(
      (admin) => admin.user.id === AdminId
    );

    if (selectedAdmin) {
      setEditData(selectedAdmin)
      setSelectedAdminId(AdminId);
      console.log("Admin Id:", AdminId);
      setIsEditModalOpen(true);
    }
  };


  const addadmin = async (formData: AddForm) => {
    try {
      await setIsAddModalOpen(false);
      setIsLoadingModalOpen(true);
      const { data } = await axios.post(`${apiUrl}/hospitals/${hospitalData.id}/manager`,
        formData,
        {
          withCredentials: true,
        })
      if (data) {
        getAllAdmin();
        setIsAddModalOpen(false);
        setIsLoadingModalOpen(false);
        enqueueSnackbar("Manager added successfully!", { variant: 'success' });
      } else {
        console.log("Something went wrong");
        setIsLoadingModalOpen(false);
        enqueueSnackbar("Something went wrong!", { variant: 'error' });
      }
      console.log("Manager added successfully", data);
    } catch (error) {
      console.log("Something went wrong in input form", error);
      enqueueSnackbar("Something went wrong!", { variant: 'error' });
      setIsLoadingModalOpen(false);
    }
  };

  //Update a Manager

  const handleUpdate = async (formData: Manager) => {
    console.log("in handleupadte");
    try {
      const res = await axios.put(`${apiUrl}/hospitals/${hospitalData.id}/managers/${selectedAdminId}`,
       { firstName: formData.user.firstName, lastName:formData.user.lastName, email:formData.user.email, phoneNumber: formData.user.phoneNumber, isPrimary:formData.isPrimary},
        { withCredentials: true }
      );

      if (res.data) {
        getAllAdmin();
        console.log('Manager Updated Successfully');
        enqueueSnackbar("Manager updated successfully!",{ variant: 'success' });
        console.log(res.data);
        setIsModalOpen(false);  
      } else {
        console.log('Update data not received');
        enqueueSnackbar("Error in Manager updation!", { variant: 'error' });
      }
    }
    catch (error) {
      console.log('Something went wrong in Update', error);
      enqueueSnackbar("Something went wrong in update", { variant: 'error' });
    }
  };



  //delete a Manager

  const handleDelete = async (Admin: { id: number } | null) => {
    try {
      setIsLoadingModalOpen(true);
      const { data } = await axios.delete(`${apiUrl}/hospitals/${hospitalData.id}/managers/${Admin?.id}`, {
        withCredentials: true,
      }
      );
      // getAllAdmin();
      console.log("delete:", data);
      console.log('Manager DeActive successfully');
      setIsLoadingModalOpen(false);
      enqueueSnackbar("Manager deleted successfully!", { variant: 'success' });
      getAllAdmin();
    } catch (error) {
      console.log(error)
      console.log("Something went wrong");
      setIsLoadingModalOpen(false);
      enqueueSnackbar("Something went wrong", { variant: 'error' });
    }
  }


  return (
    <div className={styles['container']}>
      <Breadcrumbs paths={breadcrumbs} />
      <Box >
      <Typography variant="h1" sx={{ my: '20px' }}>
          Hospital Details
        </Typography>
        <Box sx={{display:'flex'}}>
        
        {loadingHospitalInfo ? (
          <Paper
            elevation={3}
            sx={{ padding: '20px', marginBottom: '20px' }}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: '30vh',
            }}
          >
            <CircularProgress />
          </Paper>
        ) : (
          <>
            <Card className={styles['details-card']}>
              <Typography
                variant="h4"
                borderBottom="1px solid black"
                marginBottom="10px"
                paddingBottom="10px"
              >
                Profile Details
              </Typography>
              <Grid
                sx={{ mb: '10px' }}
                container
                rowSpacing={2}
                spacing={1}
                columns={2}
              >
                <Grid
                  item
                  xs={1}
                  md={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography variant="subtitle1" sx={{ mr: '20px' }}>
                    Hospital Code:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={1}
                  md={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      textWrap: 'wrap',
                      lineBreak: 'anywhere',
                      whiteSpace: 'break-spaces',
                    }}
                  >
                    {hospitalData.code}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={1}
                  md={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography variant="subtitle1" sx={{ mr: '20px' }}>
                    Email:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={1}
                  md={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      textWrap: 'wrap',
                      lineBreak: 'anywhere',
                      whiteSpace: 'break-spaces',
                    }}
                  >
                    {hospitalData.email}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={1}
                  md={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography variant="subtitle1" sx={{ mr: '20px' }}>
                    Phone Number:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={1}
                  md={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      textWrap: 'wrap',
                      lineBreak: 'anywhere',
                      whiteSpace: 'break-spaces',
                    }}
                  >
                    {hospitalData.phoneNumber}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={1}
                  md={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography variant="subtitle1" sx={{ mr: '20px' }}>
                    Country
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={1}
                  md={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      textWrap: 'wrap',
                      lineBreak: 'anywhere',
                      whiteSpace: 'break-spaces',
                    }}
                  >
                    {countryName}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
            <Card className={styles['details-card']}>
              <Typography
                variant="h4"
                borderBottom="1px solid black"
                marginBottom="10px"
                paddingBottom="10px"
              >
                Contact Details
              </Typography>
              <Grid
                sx={{ mb: '10px' }}
                container
                rowSpacing={2}
                spacing={1}
                columns={2}
              >
                <Grid
                  item
                  xs={1}
                  md={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography variant="subtitle1" sx={{ mr: '20px' }}>
                    Address Line 1:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={1}
                  md={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      textWrap: 'wrap',
                      lineBreak: 'anywhere',
                      whiteSpace: 'break-spaces',
                    }}
                  >
                    {hospitalData.addressLine1}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={1}
                  md={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography variant="subtitle1" sx={{ mr: '20px' }}>
                    Address Line 2:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={1}
                  md={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      textWrap: 'wrap',
                      lineBreak: 'anywhere',
                      whiteSpace: 'break-spaces',
                    }}
                  >
                    {hospitalData.addressLine2}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={1}
                  md={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography variant="subtitle1" sx={{ mr: '20px' }}>
                    City:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={1}
                  md={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      textWrap: 'wrap',
                      lineBreak: 'anywhere',
                      whiteSpace: 'break-spaces',
                    }}
                  >
                    {hospitalData.city}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={1}
                  md={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography variant="subtitle1" sx={{ mr: '20px' }}>
                    State:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={1}
                  md={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      textWrap: 'wrap',
                      lineBreak: 'anywhere',
                      whiteSpace: 'break-spaces',
                    }}
                  >
                    {stateName}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={1}
                  md={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography variant="subtitle1" sx={{ mr: '20px' }}>
                    Postal Code:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={1}
                  md={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography variant="body1">
                    {hospitalData.postalCode}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </>
        )}
        </Box>
        <Divider />

        <Box id={styles['Asset-container']}>
          <Box>
            <Grid container className={styles['headerStyles']}>
              <Grid item>
                <div className={styles['grid-header']}>
                  <h3 id={styles['grid_detail']}>Hospital Manager</h3>
                </div>
              </Grid>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box>
                  <AddAdmin
                    open={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={addadmin}
                  />
                  <Loading
                    open={isLoadingModalOpen}
                    onClose={() => setIsLoadingModalOpen(false)}
                  />
                </Box>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    setIsAddModalOpen(true);
                  }}
                >
                  <AddIcon fontSize="small" />
                  Add
                </Button>
              </Box>
            </Grid>
          </Box>
          {/* <Box className={styles['grid-box']}> */}
            <Box className={styles['grid-box']}>
              {loadingAllAdmin ? (
                <div className={styles['no-data']}>
                  <CircularProgress />
                </div>
               ) : (
                <TableContainer sx={{ borderRadius: '12px' }} component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Primary</TableCell>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone Number</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(adminData) && adminData.length > 0 ? (
                        adminData.map((response, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {response.isPrimary && <Chip label="Primary">Primary</Chip>}
                            </TableCell>
                            <TableCell>{response.user.firstName}</TableCell>
                            <TableCell>{response.user.lastName}</TableCell>
                            <TableCell>{response.user.email}</TableCell>
                            <TableCell>+91-{response.user.phoneNumber}</TableCell>
                            <TableCell>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditClick(response.user.id);
                                }}
                                sx={{ color: 'black' }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteModal({ id: response.user.id });
                                }}
                              >
                                <DeleteIcon color="error" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell align="center" colSpan={6}>
                            No Admin found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
               
              
            {/* </Box> */}
          </Box>
          <EditAdmin
            open={isEditModalOpen}
            onClose={closeEditModal}
            onUpdate={(data) => {
              handleUpdate(data);
              closeEditModal();
            }}
            initialData={editData} />

          <DeleteAdmin
            open={isDeleteModalOpen}
            onClose={closeDeleteModal}
            onDelete={() => {
              handleDelete(adminToDeleteId);
              closeDeleteModal();
            }}
            adminData={deleteData} />
        </Box>


      </Box>
    </div>
  );
}

export default ViewHospitalPage;
