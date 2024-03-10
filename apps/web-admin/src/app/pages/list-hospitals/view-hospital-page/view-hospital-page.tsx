import styles from './view-hospital-page.module.scss';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Paper, Grid, Box, Button, Divider, Chip, IconButton, CircularProgress } from '@mui/material';
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
      <Box sx={{ marginLeft: '25px' }}>
      <Typography variant="h1" sx={{ my: '20px' }}>
      Hospital Details
            </Typography>
            {loadingHospitalInfo ? (
      <Paper elevation={3} sx={{ padding: '20px', marginBottom: '20px' }} style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", height:"30vh"}}><CircularProgress /></Paper>
      ):(
        
            <Paper elevation={3} sx={{ padding: '20px', marginBottom: '20px' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" className={styles['hospital-field']}>
                      Name: {hospitalData.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" className={styles['hospital-field']}>
                      Email: {hospitalData.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" className={styles['hospital-field']}>
                      Phone Number: +91-{hospitalData.phoneNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" className={styles['hospital-field']}>
                      Address 1: {hospitalData.addressLine1}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" className={styles['hospital-field']}>
                      Address 2: {hospitalData.addressLine2 || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" className={styles['hospital-field']}>
                      City: {hospitalData.city}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" className={styles['hospital-field']}>
                      Country: {hospitalData.countryCode}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" className={styles['hospital-field']}>
                      State: {hospitalData.stateCode || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" className={styles['hospital-field']}>
                      Postal Code: {hospitalData.postalCode}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" className={styles['hospital-field']}>
                      Code: {hospitalData.code}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              )
        }
              <Divider />
        
        <Box id={styles['Asset-container']}>
          <Box>
            <Grid container className={styles['headerStyles']}>
              <Grid item >
                <div className={styles['grid-header']}>
                  <h3 id={styles['grid_detail']}>Hospital Manager</h3>
                </div>
              </Grid>
              <Grid xs={2} item>
                <Box>
                  <AddAdmin
                    open={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={addadmin}
                  />
                    <Loading open={isLoadingModalOpen}
                    onClose={() => setIsLoadingModalOpen(false)} />
                </Box>
                <Button
                  className={styles['add_btn']}
                  onClick={() => {
                    setIsAddModalOpen(true)
                  }}>
                  <AddIcon fontSize='small' />Add
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box className={styles['grid-box']}>
          {loadingAllAdmin ? (
            <div className={styles['no-data']}><CircularProgress /></div>
                  
              ) : (Array.isArray(adminData) && adminData.length > 0 ? (
              adminData.map((response: Manager, index: number) => (
                <Grid container key={index} columnGap={2} className={styles['grid-container']}>
                   <Grid item xs={12} md={1}><div className={styles['resident-primary']}>{response.isPrimary===true ?(<Chip label="primary" color="primary" variant="outlined" />):(<></>)}</div></Grid>
                  <Grid item xs={2}><div className={styles['resident-name']}>{response.user.firstName}</div></Grid>
                  <Grid item xs={2}> <div className={styles['resident-phone']}>{response.user.lastName}</div></Grid>
                  <Grid item xs={2}> <div className={styles['resident-phone']}>{response.user.email}</div></Grid>
                  <Grid item xs={2}> <div className={styles['resident-phone']}>+91-{response.user.phoneNumber}</div></Grid>
                  <Grid item xs={2}><div className={styles['resident-actions']}>
                    
                    <IconButton onClick={(e) => {
                        e.stopPropagation()
                        handleEditClick(response.user.id)
                      }} sx={{mt:"-13px", color:'black'}}>
                      <EditIcon>
                        Edit
                      </EditIcon>
                    </IconButton>
                    <IconButton sx={{mt:"-13px"}} onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal({ id: response.user.id })
                    }}>
                    <DeleteIcon color="error">
                      Delete
                    </DeleteIcon>
                    </IconButton>
                    
                  </div>
                  </Grid>
                </Grid>
              ))
            ) : (
              <div className={styles['no-data']}>No Admin found</div>
              )
              )}
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
