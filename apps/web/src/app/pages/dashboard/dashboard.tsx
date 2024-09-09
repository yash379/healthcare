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

const columns: GridColDef[] = [
  { field: 'vehicle', headerName: 'Vehcile', width: 100, flex: 1 },
  // {field:'id', headerName:"Id", width:90},
  {
    field: 'device',
    headerName: 'Device',
    width: 100,
    editable: false,
    flex: 1,
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 100,
    editable: false,
    flex: 1,
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 100,
    editable: false,
    flex: 1,
  },
  {
    field: 'direction',
    headerName: 'Direction',
    type: 'number',
    width: 100,
    editable: false,
    flex: 1,
  },
  {
    field: 'status',
    headerName: 'Status',
    type: 'number',
    width: 100,
    editable: false,
    flex: 1,
    // maxWidth:200
  },
];

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
  const dashboardCards = [
    'Buildings',
    'Flats',
    'Residents',
    'Vehicles',
    'Devices',
  ];

  const getRandomName = () => {
    // Replace this with a function that generates random names
    const names = ['John Doe', 'Jane Smith', 'Alice Johnson'];
    return names[Math.floor(Math.random() * names.length)];
  };

  const getRandomCarNumber = () => {
    // Replace this with a function that generates random car numbers
    return `MH01-XS-${Math.floor(Math.random() * 10000)}`;
  };

  // const data = Array.from({ length: 3 }, (_, index) => ({
  //   id: index,
  //   name: getRandomName(),
  //   // name: getRandomName(),
  //   carNumber: getRandomCarNumber(),
  //   imageUrl: `https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90`,
  // }));

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

  const generateRandomData = () => ({
    id: Math.floor(Math.random() * 1000),
    vehicle: `Vehicle-${Math.floor(Math.random() * 1000)}`,
    device: `Device-${Math.floor(Math.random() * 1000)}`,
    date: new Date().toLocaleDateString(),
    type: Math.random() > 0.5 ? 'TWO_WHEELER' : 'FOUR_WHEELER',
    direction: Math.random() > 0.5 ? 'In' : 'Out',
    status: Math.random() > 0.5 ? 'Active' : 'Inactive',
  });

  const data = Array.from({ length: 10 }, (_, index) => generateRandomData());

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

  const handleExport = async (exportType: string) => {
    try {
      let apiUrls;
      switch (exportType) {
        case 'residents':
          apiUrls = `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/residents/export`;
          break;
        case 'vehicles':
          apiUrls = `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/vehicles/export`;
          break;
        default:
          console.error('Invalid import type');
          return;
      }
      const response = await axios.get(apiUrls, {
        withCredentials: true,
        responseType: 'blob', // Important: Set the responseType to 'blob'
      });

      console.log('API response:', response);

      if (response && response.data) {
        console.log('Response data available');
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `exported_${exportType}_data.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        enqueueSnackbar('Excel file Exported successfully!', {
          variant: 'success',
        });
        // getSingleBuildingFlats();
        setModalExportOpen(false);
        console.log('API response:', response);
      } else {
        console.log('Error Exporting file');
        enqueueSnackbar('Error Exporting file!', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error Exporting file to API', error);
      enqueueSnackbar('Error Exporting file!', { variant: 'error' });
    }
  };

  const handleExportFlatType = async (exportType: string) => {
    try {
      let apiUrls;
      switch (exportType) {
        case 'flats':
          apiUrls = `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/flats`;
          break;
        case 'residents':
          apiUrls = `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/residents/export`;
          break;
        case 'vehicles':
          apiUrls = `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/vehicles/export`;
          break;
        default:
          console.error('Invalid import type');
          return;
      }
      const response = await axios.get(apiUrls, {
        withCredentials: true,
      });
      if (response) {
        try {
          // const response = await axios.get(`${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/flats`, {
          //   withCredentials: true
          // });
          const hospitalsData = response.data.content;
          const excludedFields = ['id', 'isActive'];
          const exportData = convertDataToExcel(hospitalsData, excludedFields);

          const blob = new Blob([exportData], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `exported_${exportType}_data.xlsx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch (error) {
          console.error('Error fetching data from API:', error);
        }

        enqueueSnackbar('Excel file Exported successfully!', {
          variant: 'success',
        });
        // getSingleBuildingFlats();
        setModalExportOpen(false);
        console.log('API response:', response);
      } else {
        console.log('Error Exporting file');
        enqueueSnackbar('Error Exporting file!', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error Exporting file to API', error);
      enqueueSnackbar('Error Exporting file!', { variant: 'error' });
    }
  };

  const flattenObject = (
    obj: Record<string, any>,
    prefix = ''
  ): Record<string, any> => {
    console.log('obj:', obj);
    return Object.keys(obj).reduce((acc, key) => {
      const pre = prefix.length ? prefix + '.' : '';

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (key !== 'id' && key !== 'hospital') {
          // Recursively flatten nested objects
          //traverse recursively till we reach hospital after that move to else part
          Object.assign(acc, flattenObject(obj[key], pre + key));
        }
      } else {
        // Check for specific keys and handle them accordingly
        //if key matches any one value then traverse
        // if (key === 'number' || key === 'floor.number' || key === 'floor.building.name') {
        if (key === 'floor.building.name') {
          // Extract building name from nested structure
          acc[pre + 'Building Name'] = obj[key];
        } else {
          acc[pre + key.replace('floor.', '')] = obj[key];
        }
        // }
      }

      return acc;
    }, {} as Record<string, any>);
  };

  const convertDataToExcel = (
    data: Record<string, any>[],
    excludedFields: string[]
  ) => {
    if (!data.length) {
      return new ArrayBuffer(0);
    }

    // Define a mapping of export types to data transformation functions
    const dataTransformers: Record<
      string,
      (row: Record<string, any>) => Record<string, any>
    > = {
      flats: (row) => ({
        'Building Name': row['floor.building.name'],
        'Floor Number': row['floor.number'],
        'Flat Number': row['number'],
      }),
      residents: (row) => ({
        'Building Name': row['flats.flat.floor.building.name'],
        'Floor Number': row['flats.flat.floor.number'],
        'Flat Number': row['flats.flat.number'],
        Name: row['name'],
        Type: row['flats.flat.type'],
        Email: row['email'],
        'Phone Number': row['phoneNumber'],
        'Is Child?': row['isChild'],
        'Is Primary?': row['flats.isPrimary'],
        // Add other resident-related fields as needed
      }),
      vehicles: (row) => ({
        'Building Name': row['floor.building.name'],
        'Flat Number': row['number'],
        'Vehicle Number': row['vehicle.number'],
        // Add other vehicle-related fields as needed
      }),
    };

    const dataTransformer = dataTransformers[exportType];

    if (!dataTransformer) {
      console.error('Invalid export type');
      return new ArrayBuffer(0);
    }

    const flattenedData = data.map((row) => flattenObject(row));
    const filteredData = flattenedData.map((row) =>
      Object.keys(row).reduce((acc, key) => {
        if (!excludedFields.includes(key)) {
          acc[key] = row[key];
        }
        return acc;
      }, {} as Record<string, any>)
    );

    const rearrangedData = filteredData.map(dataTransformer);

    const worksheet = XLSX.utils.json_to_sheet(rearrangedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    const excelData: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      bookSST: false,
      type: 'array',
    });

    return new Blob([excelData], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setImportType('');
    setSelectedFile(null); // Reset selectedFile
    setShowFileInput(false); // Reset showFileInput
  };

  const handleCloseExportModal = () => {
    setModalExportOpen(false);
    setExportType('');
  };

  const handleImportType = (type: string) => {
    console.log('type selected');
    if (type !== null) {
      openFileInput();
      setImportType(type);
    } else {
      console.error('No file selected');
    }
  };

  const handleExportType = (type: string) => {
    console.log('type selected');
    if (type !== null) {
      setExportType(type);
      handleExport(type);
    } else {
      console.error('No Type selected');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // document.getElementById('excel-file-input')?.click();

    if (!file) {
      return;
    }
    setSelectedFile(file);
    uploadFileToAPI(file, importType);
  };

  const openFileInput = () => {
    document.getElementById('excel-file-input')?.click();
    console.log('input clicked!');
    setModalOpen(false);
  };

  const uploadFileToAPI = async (file: File | null, importType: string) => {
    if (!file) {
      console.error('No file selected');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      let apiUrls;
      // Set the API URL based on the import type
      switch (importType) {
        case 'flats':
          apiUrls = `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/flats/bulkupload`;
          break;
        case 'residents':
          apiUrls = `${apiUrl}/hospitals/${hospitalcontext?.hospital?.id}/residents/bulkupload`;
          break;
        case 'vehicles':
          apiUrls = `${apiUrl}/hospital/${hospitalcontext?.hospital?.id}/vehicles/bulkupload`;
          break;
        default:
          console.error('Invalid import type');
          return;
      }
      const response = await axios.post(apiUrls, formData, {
        withCredentials: true,
      });
      if (response) {
        enqueueSnackbar('Excel file uploaded ssuccessfully!', {
          variant: 'success',
        });
        setModalOpen(false);
        console.log('API response:', response);
      } else {
        console.log('Error uploading file');
        enqueueSnackbar('Error uploading file!', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error uploading file to API', error);
      enqueueSnackbar('Error uploading file!', { variant: 'error' });
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseTemplateModal = () => {
    setIsModalOpen(false);
  };

  //Download template files
  const handleOptionSelect = async (option: string) => {
    setSelectedOption(option);
    try {
      let templateFilePath = '';

      switch (option) {
        case 'building':
          templateFilePath = '/src/assets/templates/buildingData.xlsx';
          break;
        case 'flat':
          templateFilePath = '/src/assets/templates/flatBulkUpload.xlsx';
          break;
        case 'resident':
          templateFilePath = '/src/assets/templates/ResidentBulkUpload.xlsx';
          break;
        case 'vehicle':
          templateFilePath = '/src/assets/templates/vehicleBulkUpload.xlsx';
          break;
        default:
          console.error('Invalid template option');
          return;
      }
      const response = await fetch(templateFilePath);
      const blob = await response.blob();

      const contentType =
        response.headers.get('content-type') || 'application/octet-stream';

      const filename = `template_${option}.xlsx`;
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: contentType })
      );

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
      handleCloseTemplateModal();
    } catch (error) {
      console.error('Error downloading template:', error);
      handleCloseTemplateModal();
    }
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
            <div className={styles['header']}>
              {/* <h1 style={{ marginLeft: '0px' }}>{hospital?.name}</h1>   */}
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

              <Card className={styles['cards']}>
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
              </Card>
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
