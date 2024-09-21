import styles from './dashboard.module.scss';
import React, { useState, useEffect, useContext } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {
  Box,
  IconButton,
  Chip,
  Button,
  CardActionArea,
  CardActions,
  Grid,
  Divider,
  Modal,
} from '@mui/material';
import { environment } from '../../../environments/environment';

import { Hospital } from '@healthcare/data-transfer-types';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { HospitalContext } from '../../contexts/hospital-context';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddAdmin from './add-admin/add-admin';
import EditAdmin from './edit-admin/edit-admin';
import DeleteAdmin from './delete-admin/delete-admin';
import { enqueueSnackbar } from 'notistack';
import Loading from '../../Components/loading/loading';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import { ForkLeft } from '@mui/icons-material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TemplateOptions from './template-options/template-options';
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DoctorContext from '../../contexts/doctor-context';
import PatientContext from '../../contexts/patient-context';
import UserContext from '../../contexts/user-context';
import ListPatients from '../list-patient/list-patient';
import ListDashboardPatients from '../list-dashboard-patients/list-dashboard-patients';
import DashboardChart from '../dashboard-chart/dashboard-chart';
import DashboardAppointments from '../../Components/dashboard-appointments/dashboard-appointments';

/* eslint-disable-next-line */
export interface DashboardProps {}


interface HospitalDetails {
  id: string;
  isActive: boolean;
  // assetCount: assetCount[];
  name: string;
}

interface Manager {
  id: number;
  isPrimary: boolean;
  hospitalRole: {
    name: string;
  };
  user: {
    id: number;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
  };
}

interface AddForm {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}



export function Dashboard(props: DashboardProps) {
  const [hospitaldata, setHospitalData] = useState<HospitalDetails[]>([]);
  const [hospitalId, setHospitalId] = useState<string>('');
  const [hospital, setHospital] = useState<Hospital>();
  const apiUrl = environment.apiUrl;
  const user = useContext(UserContext);
  const [refreshLogs, setRefreshLogs] = useState(false);
  const [loadingCount, setLoadingCount] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingAddAdmin, setLoadingAddAdmin] = useState(true);
  const [loadingAllAdmin, setLoadingAllAdmin] = useState(true);
  const [adminData, setAdminData] = useState<Manager[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDeleteId, setAdminToDeleteId] = useState<{ id: number } | null>(
    null
  );
  const [editData, setEditData] = useState<Manager | null>(null);
  const [deleteData, setDeleteData] = useState<Manager | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);
  const [adminlength, setadminlength] = useState();

  const [modalOpen, setModalOpen] = useState(false);
  const [importType, setImportType] = useState('');
  const [modalExportOpen, setModalExportOpen] = useState(false);
  const [exportType, setExportType] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFileInput, setShowFileInput] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const params = useParams();
  console.log('params:', params.hospitalId);

  const hospitalcontext = useContext(HospitalContext);
  console.log('hospital context:', hospitalcontext);
  console.log('hospital id:', hospitalcontext?.hospital?.id);

  const doctorContext=useContext(DoctorContext);
  const patientcontext=useContext(PatientContext);

  console.log("patients context:", patientcontext);
  console.log("doctor context:", doctorContext);

  
  

  const getAllAdmin = async () => {
    try {
      setLoadingAllAdmin(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(
        `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/managers`,
        {
          withCredentials: true,
        }
      );
      // console.log(response.data[0].user)
      const sortedDoctors = response.data.sort((a: any, b: any) => {
        if (a.isPrimary && !b.isPrimary) {
          return -1;
        } else if (!a.isPrimary && b.isPrimary) {
          return 1;
        } else {
          return 0;
        }
      });
      setAdminData(sortedDoctors);
      console.log('Admin Data', response.data);
      setadminlength(response.data.length);
      setLoadingAllAdmin(false);
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      setLoadingAllAdmin(false);
    }
  };

  useEffect(() => {
    getAllAdmin();
  }, [hospitalcontext?.hospital?.id]);

  console.log('user details', user);
  

  // const keys=Object.keys(count);
  // const entries=Object.entries(count);
  // console.log(keys,entries);

  const getCount = async () => {
    try {
      setLoadingCount(true);
      const response = await axios.get(
        `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/asset-count`,
        {
          withCredentials: true,
        }
      );

      console.log('assestcount:', response.data.assestcount);
      console.log('hospitalid:', response.data.id);
      // setCount(response.data.assetcount);
      setHospitalData(response.data);
      setHospitalId(response.data.id);
      setLoadingCount(false);
    } catch (error) {
      console.log('Error in Fetching assetCount', error);
      setLoadingCount(false);
    }
  };
  console.log('Response Data of AssetCount:', hospitaldata);

  const getHospitaldetails = async () => {
    console.log('hospitalId:', hospitalId);
    try {
      setLoadingDetails(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(
        `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}`,
        {
          withCredentials: true,
        }
      );
      console.log('Hospital Details:', response.data);
      setHospital(response.data);
      setLoadingDetails(false);
    } catch (error) {
      console.log('Error in fetching hospital details:', error);
      setLoadingDetails(false);
    }
  };


  // const countArray = Object.entries(count);
  // console.log(countArray);

  const handleRefresh = () => {
    console.log('Refreshed clicked');
    setRefreshLogs(true);
  };

  const addadmin = async (formData: AddForm) => {
    try {
      await setIsAddModalOpen(false);
      setIsLoadingModalOpen(true);
      const { data } = await axios.post(
        `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/manager`,
        formData,
        {
          withCredentials: true,
        }
      );
      if (data) {
        getAllAdmin();
        setIsAddModalOpen(false);
        setIsLoadingModalOpen(false);
        enqueueSnackbar('Manager added successfully!', { variant: 'success' });
      } else {
        console.log('Something went wrong');
        setIsLoadingModalOpen(false);
      }
      console.log('Manager added successfully', data);
    } catch (error) {
      console.log('Something went wrong in input form', error);
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
      setIsLoadingModalOpen(false);
    }
  };

  //Update a Manager

  const handleUpdate = async (formData: Manager) => {
    console.log('in handleupadte');
    try {
      const res = await axios.put(
        `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/managers/${selectedAdminId}`,
        {
          firstName: formData.user.firstName,
          lastName: formData.user.lastName,
          email: formData.user.email,
          phoneNumber: formData.user.phoneNumber,
          isPrimary: formData.isPrimary,
        },
        { withCredentials: true }
      );

      if (res.data) {
        getAllAdmin();
        console.log('Manager Updated Successfully');
        enqueueSnackbar('Manager updated successfully!', {
          variant: 'success',
        });
        console.log(res.data);
        // setIsModalOpen(false);
      } else {
        console.log('Update data not received');
        enqueueSnackbar('Error in Manager updation!', { variant: 'error' });
      }
    } catch (error) {
      console.log('Something went wrong in Update', error);
      enqueueSnackbar('Something went wrong in update', { variant: 'error' });
    }
  };

  //delete a Manager

  const handleDelete = async (Admin: { id: number } | null) => {
    try {
      setIsLoadingModalOpen(true);
      const { data } = await axios.delete(
        `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/managers/${Admin?.id}`,
        {
          withCredentials: true,
        }
      );
      // getAllAdmin();
      console.log('delete:', data);
      console.log('Manager DeActive successfully');
      setIsLoadingModalOpen(false);
      enqueueSnackbar('Manager deleted successfully!', { variant: 'success' });
      getAllAdmin();
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
      setIsLoadingModalOpen(false);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  useEffect(() => {
    getCount();
  }, [user, hospitalcontext]);

  useEffect(() => {
    getHospitaldetails();
  }, [hospitalcontext]);

  useEffect(() => {
    getHospitaldetails();
  }, [user]);

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
      setEditData(selectedAdmin);
      setSelectedAdminId(AdminId);
      console.log('Admin Id:', AdminId);
      setIsEditModalOpen(true);
    }
  };

  const openDeleteModal = (Admin: { id: number } | null) => {
    const selectedAdmin: Manager | undefined = adminData.find(
      (Admins) => Admins.user.id === Admin?.id
    );

    if (selectedAdmin) {
      setDeleteData(selectedAdmin);
      setAdminToDeleteId(Admin);
      console.log('AdminToDeleteId:', adminToDeleteId);
      setIsDeleteModalOpen(true);
    }
  };


  const handleCloseModal = () => {
    setModalOpen(false);
    setImportType('');
    setSelectedFile(null); // Reset selectedFile
    setShowFileInput(false); // Reset showFileInput
  };

  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseTemplateModal = () => {
    setIsModalOpen(false);
  };

  

  return (
    <div className={styles['container']}>
      {loadingDetails ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: '75vh',
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <div className={styles['main_container']}>
          <div className={styles['first_container']}>
            {/* <div className={styles['header']}>
              <h1 style={{ marginLeft: '0px' }}>{hospital?.name}</h1>  
            </div> */}

          <Box sx={{display:'flex', margin:'20px',position:'relative',top:'3%'}}>
            <Box style={{width:'70%'}}>
              <DashboardChart/>
            </Box>

            <Box style={{width:'30%'}}>
              <DashboardAppointments/>
            </Box>
           </Box>

           <div style={{margin:'10px',display:'flex',flexDirection:'column'}}>
            <ListDashboardPatients/>
          </div>

         
            
            <div className={styles['dashboard-card-container']}>
              {/* <Card
                sx={{ minWidth: '40% ' }}
                className={styles['hospital-details']}
              > */}
                {/* <CardContent>
                  <Typography variant="body2">
                    <div className={styles['soc-detail-add']}>
                      <LocalPhoneIcon sx={{ marginRight: '4px' }} />
                      {hospital?.phoneNumber}
                    </div>
                    <br />
                    <div className={styles['soc-detail-add']}>
                      <EmailIcon sx={{ marginRight: '4px' }} />
                      {hospital?.email}
                    </div>
                    <br />
                    <div className={styles['soc-detail-add']}>
                      <HomeIcon sx={{ marginRight: '4px' }} />
                      {hospital?.addressLine1}, {hospital?.addressLine2},{' '}
                      {hospital?.city}, {hospital?.stateCode},{' '}
                      {hospital?.countryCode}, {hospital?.postalCode}
                    </div>
                  </Typography>
                </CardContent> */}
              {/* </Card> */}
            
              

              {/* <Card className={styles['cards']}>
                <CardContent className={styles['cardcontent']}>
                <Typography
                    variant="h4"
                    color="text.fourth"
                    gutterBottom
                    className={styles['fields-icons']}
                  >
                   <CurrencyRupeeOutlinedIcon sx={{p:"10px",color:"#3371EB", backgroundColor:"#EEF3FF"}} />
                  </Typography>
                  <Typography
                    variant="h4"
                    color="text.fourth"
                    gutterBottom
                    className={styles['fields']}
                  >
                    Earnings
                  </Typography>
                  <Typography className={styles['count']}>
                   23,425
                    <br />
                  </Typography>
                </CardContent>
              </Card>
              <Card className={styles['cards']}>
                <CardContent className={styles['cardcontent']}>
                <Typography
                    variant="h4"
                    color="text.fourth"
                    gutterBottom
                    className={styles['fields-icons']}
                  >
                   <PersonIcon sx={{p:"10px",color:"#FF8024", backgroundColor:"#FFF4F2"}} />
                  </Typography>
                  <Typography
                    variant="h4"
                    color="text.fourth"
                    gutterBottom
                    className={styles['fields']}
                  >
                    New Patient
                  </Typography>
                  <Typography className={styles['count']}>
                   1,925
                    <br />
                  </Typography>
                </CardContent>
              </Card>
              <Card className={styles['cards']}>
                <CardContent className={styles['cardcontent']}>
                <Typography
                    variant="h4"
                    color="text.fourth"
                    gutterBottom
                    className={styles['fields-icons']}
                  >
                   <AssignmentIcon sx={{p:"10px",color:"#14CC26", backgroundColor:"#EBFFE8"}} />
                  </Typography>
                  <Typography
                    variant="h4"
                    color="text.fourth"
                    gutterBottom
                    className={styles['fields']}
                  >
                    New Appointment
                  </Typography>
                  <Typography className={styles['count']}>
                   153
                    <br />
                  </Typography>
                </CardContent>
              </Card>
              <Card className={styles['cards']}>
                <CardContent className={styles['cardcontent']}>
                <Typography
                    variant="h4"
                    color="text.fourth"
                    gutterBottom
                    className={styles['fields-icons']}
                  >
                   <PeopleAltIcon sx={{p:"10px",color:"#9F0086", backgroundColor:"#FFE8FD"}} />
                  </Typography>
                  <Typography
                    variant="h4"
                    color="text.fourth"
                    gutterBottom
                    className={styles['fields']}
                  >
                    Patient Visit
                  </Typography>
                  <Typography className={styles['count']}>
                   20
                    <br />
                  </Typography>
                </CardContent>
              </Card> */}
              {/* <div className={styles['dashboard-cards']}>
                {countArray.map(([item, value]) => (
                  <Card className={styles['cards']}>
                    <Link style={{ textDecoration: "none", cursor: item === "Residents" || item === "Vehicles" ? "default" : "pointer", }} to={`/hospital/${hospitalcontext?.hospital?.id}/${item === "Floors" ? "Buildings" : item.toLowerCase()}`} onClick={(e) => {
                      if (item === "Residents" || item === "Vehicles") {
                        e.preventDefault();

                        console.log(`${item} clicked, no redirect.`);
                      }
                    }}>
                      <CardContent className={styles['cardcontent']}>
                        <Typography variant="h6" color="text.secondary" gutterBottom className={styles['fields']}>
                          {item}
                        </Typography>
                        <Typography className={styles['count']}>
                          {value}
                          <br />
                        </Typography>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
                 <Card className={styles['cards']}>
                      <CardContent className={styles['cardcontent']}>
                        <Typography variant="h6" color="text.secondary" gutterBottom className={styles['fields']}>
                          Managers
                        </Typography>
                        <Typography className={styles['count']}>
                          {adminlength}
                          <br />
                        </Typography>
                      </CardContent>
                  </Card>
              </div> */}

          

            </div>

            {/* <div className={styles['horizontal-line']} /> */}

            {/* <div>
  {data.map((item) => (
    <Card
      key={item.id}
      className={styles['logs-card']}
      sx={{
        display: 'flex',
        maxWidth: 300,
        border: '1px solid #ddd',
        borderRadius: 5,
        margin: 2,
      }}
    >
      <div className={styles['active-logs']} />
      <CardMedia
        component="img"
        height="140"
        image={item.imageUrl}
        alt="Image Description"
        className={styles['cardmedia']}
      />
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="body2" component="div" className={styles['logs-name']}>
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Car Number: {item.carNumber}
        </Typography>
      </CardContent>
    </Card>
  ))}
</div> */}

            {/* <Box sx={{ height: 400, width: '90%', display:'flex', flexDirection:'row', margin:'20px' }}>
  <DataGrid
    rows={data}
    columns={columns}
    initialState={{
      pagination: {
        paginationModel: {
          pageSize: 5,
        },
      },
    }}
    pageSizeOptions={[5]}
    checkboxSelection
    disableRowSelectionOnClick
  />
</Box> */}

            {/* <Box className={styles['logs']}>
              <Box style={{ margin: '9px', float: 'right', display: 'flex', justifyContent: 'flex-end' }}>
                <RefreshIcon onClick={handleRefresh} style={{ cursor: 'pointer' }} />
              </Box> */}
            {/* <AllVehicleLogs refreshLogs={refreshLogs} /> */}
            {/* </Box> */}
          </div>

          {/* <div className={styles['vertical-line']} /> */}

          <div className={styles['rightColumn']}>
            {/* <Box className={styles['import-export']}> */}
            {/* <Button startIcon={<InsertDriveFileIcon/>} color="info"
              variant="contained"  onClick={handleOpenModal} className={styles['import-export-button']}>Template</Button>

        <TemplateOptions open={isModalOpen} onClose={handleCloseTemplateModal} onSelect={handleOptionSelect} /> */}

            {/* <>
                  <Button
                    startIcon={<FileUploadIcon />}
                    color="info"
                    variant="contained"
                    onClick={() => setModalOpen(true)}
                    className={styles['import-export-button']}
                  >
                    Import
                  </Button>
                  <Modal open={modalOpen} onClose={handleCloseModal}>
                    <Box  className={styles['modal-container']}>
                    <div>
                      <h2  className={styles['h2_tag']} >Select Import Type</h2>
                        <Button color="info" variant="contained" onClick={() => handleImportType('flats')}>Import Flats</Button>
                        <Button color="info" variant="contained" onClick={() => handleImportType('residents')}>Import Residents</Button>
                        <Button color="info" variant="contained" onClick={() => handleImportType('vehicles')}>Import Vehicles</Button>
                      
                    </div>
                    </Box>
                  </Modal>
                </> */}

            {/* {showFileInput && ( */}
            {/* <input
                    type="file"
                    id="excel-file-input"
                    accept=".xls, .xlsx"
                    style={{ display: 'none' }}
                    onChange={handleImport}
                  /> */}
            {/* )} */}

            {/* <Button
              startIcon={<DownloadIcon/>}
              color="info"
              variant="contained"
              onClick={() => setModalExportOpen(true)}
              className={styles['import-export-button']}
            >
              Export
            </Button> */}
            {/* <Modal open={modalExportOpen} onClose={handleCloseExportModal}>
                    <Box  className={styles['modal-container']}>
                    <div>
                      <h2 className={styles['h2_tag']}>Select Export Type</h2>
                        <Button color="info" variant="contained" onClick={() => handleExportFlatType('flats')}>Export Flats</Button>
                        <Button color="info" variant="contained" onClick={() => handleExportType('residents')}>Export Residents</Button>
                        <Button color="info" variant="contained" onClick={() => handleExportType('vehicles')}>Export Vehicles</Button>
              
                    </div>
                    </Box>
            </Modal>       */}

            {/* </Box> */}

            {/* <div className={styles['column_second']}> */}

            {/* <Grid container className={styles['headerStyles']}>
              <Grid item sx={{width:'100%'}}>
                <div className={styles['grid-header']}>
                  <h3 id={styles['grid_detail']}>Managers</h3>
                  <Button
                    className={styles['add_btn']}
                    onClick={() => {
                      setIsAddModalOpen(true)
                    }}
                  >
                    <AddIcon fontSize='small' />Add
                  </Button>
                </div>
                <div className={styles['manager-horizontal-line']} />
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

              </Grid>
            </Grid>
            <Box className={styles['grid-box']}>
              {loadingAllAdmin ? (
                <div className={styles['no-data']}><CircularProgress /></div>

              ) : (Array.isArray(adminData) && adminData.length > 0 ? (
                adminData.map((response: Manager, index: number) => (
                  <Grid container key={index} columnGap={3} className={styles['grid-container']}> */}
            {/* <Grid item xs={12} md={1}><div className={styles['resident-primary']}>{response.isPrimary === true ? (<Chip label="primary" color="primary" variant="outlined" />) : (<></>)}</div></Grid> */}
            {/* <Grid item xs={3} md={1.5} ><div className={styles['resident-name']}>{response.user.firstName}</div></Grid> */}
            {/* <Grid item xs={2}> <div className={styles['resident-phone']}>{response.user.lastName}</div></Grid> */}
            {/* <Grid item xs={2}> <div className={styles['resident-phone']}>{response.user.email}</div></Grid>
                  <Grid item xs={2}> <div className={styles['resident-phone']}>+91-{response.user.phoneNumber}</div></Grid> */}
            {/* <Grid item xs={1} className={styles['resident-actions']}>
                      
                      <IconButton onClick={(e) => {
                        e.stopPropagation()
                        handleEditClick(response.user.id)
                      }} sx={{ mt: "-13px", color: 'black' }}>
                        <EditIcon>
                          Edit
                        </EditIcon>
                      </IconButton>
                      <IconButton sx={{ mt: "-13px" }} onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal({ id: response.user.id })
                      }}>
                        <DeleteIcon color="error">
                          Delete
                        </DeleteIcon>
                      </IconButton>
                    </Grid>
                  </Grid> */}
            {/* ))
              ) : (
                <div className={styles['no-data']}>No Admin found</div>
              )
              )} */}
            {/* </Box> */}
            {/* <EditAdmin
              open={isEditModalOpen}
              onClose={closeEditModal}
              onUpdate={(data) => {
                handleUpdate(data);
                closeEditModal();
              }}
              initialData={editData} /> */}

            {/* <DeleteAdmin
              open={isDeleteModalOpen}
              onClose={closeDeleteModal}
              onDelete={() => {
                handleDelete(adminToDeleteId);
                closeDeleteModal();
              }}
              adminData={deleteData} /> */}

            {/* </div> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
