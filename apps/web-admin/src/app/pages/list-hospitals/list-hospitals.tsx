import styles from './list-hospitals.module.scss';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { NavLink, useParams } from 'react-router-dom';
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Autocomplete,
  TextField,
  Button,
  Modal,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Checkbox,
  CircularProgress,
  Pagination,
  PaginationItem,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
// import Breadcrumbs from '../../Component/bread-crumbs/bread-crumbs';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Hospital, ViewHospital } from '@healthcare/data-transfer-types';
import CustomBreadcrumbs from '../../Components/bread-crumbs/bread-crumbs';
import AddHospitalComponent from './add-hospital/add-hospital';
import DeleteHospitalComponent from './delete-hospital/delete-hospital';
import EditHospitalComponent from './edit-hospital/edit-hospital';
import AddIcon from '@mui/icons-material/Add';
import { enqueueSnackbar } from 'notistack';
import IconButton from '@mui/material/IconButton';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import BlockIcon from '@mui/icons-material/Block';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { CountriesStates } from '../../core/consts/countries-states';

export interface AddHospital {
  name: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  isActive: boolean;
  code: string;
}

/* eslint-disable-next-line */
export interface ListHospitalsProps {}

export function ListHospitals(props: ListHospitalsProps) {
  // const apiUrl = environment.apiUrl;
  // const [activeHospitals, setActiveHospitals] = useState<ViewHospital[]>([]);
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [searchQueryName, setSearchQueryName] = useState<string>('');
  // const [searchQueryCity, setSearchQueryCity] = useState<string>('');
  // const [searchQueryStateCode, setSearchQueryStateCode] = useState<string>('');
  // const [searchQueryCountryCode, setSearchQueryCountryCode] =
  //   useState<string>('');
  // const [searchQueryPostalCode, setSearchQueryPostalCode] =
  //   useState<string>('');
  // const navigate = useNavigate();
  // const [actives, setActives] = useState<boolean>();
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(
  //   null
  // );
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [HospitalToDeleteId, setHospitalToDeleteId] = useState<{
  //   id: number;
  //   isActive: boolean | undefined;
  // } | null>(null);
  // const [totalItems, setTotalItems] = useState(0);

  // const [editData, setEditData] = useState<ViewHospital | null>(null);
  // const [deleteData, setDeleteData] = useState<ViewHospital | null>(null);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [selectedItems, setSelectedItems] = useState<number[]>([]);
  // const [loading, setLoading] = useState(true);

  // const getHospitals = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(`${apiUrl}/hospitals`, {
  //       withCredentials: true,
  //       params: {
  //         pageSize: rowsPerPage,
  //         pageOffset: page,
  //         name: searchQueryName,
  //         city: searchQueryCity,
  //         stateCode: searchQueryStateCode,
  //         countryCode: searchQueryCountryCode,
  //         postalCode: searchQueryPostalCode,
  //       },
  //     });

  //     const { content, total } = response.data;
  //     setTotalItems(total);
  //     setActiveHospitals(content);
  //     console.log(content);
  //     setLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //     console.log('Something went wrong');
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getHospitals();
  // }, [
  //   page,
  //   rowsPerPage,
  //   searchQueryName,
  //   searchQueryCity,
  //   searchQueryStateCode,
  //   searchQueryPostalCode,
  //   searchQueryCountryCode,
  // ]);

  // const handleFilterChange = () => {
  //   setPage(0);
  // };

  // useEffect(() => {
  //   handleFilterChange();
  // }, [
  //   searchQueryName,
  //   searchQueryCity,
  //   searchQueryStateCode,
  //   searchQueryPostalCode,
  //   searchQueryCountryCode,
  // ]);

  // // Add Building

  // const handleAddHospital = async (newData: AddHospital) => {
  //   try {
  //     const { data: responseData } = await axios.post(
  //       `${apiUrl}/hospitals`,
  //       newData,
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     if (responseData) {
  //       enqueueSnackbar('Hospital added successfully!', { variant: 'success' });
  //       setIsAddModalOpen(false);
  //       getHospitals();
  //     } else {
  //       console.log('Something went wrong');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     enqueueSnackbar('Something went wrong', { variant: 'error' });
  //     console.log('Something went wrong in input form');
  //   }
  // };

  // //Building Update CloseModal

  // const closeEditModal = () => {
  //   setIsEditModalOpen(false);
  //   setSelectedHospitalId(null);
  // };

  // const closeAddModal = () => {
  //   setIsAddModalOpen(false);
  //   setSelectedHospitalId(null);
  // };

  // const handleSearchNameChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setSearchQueryName(event.target.value);
  //   getHospitals();
  // };

  // const handleSearchCityChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setSearchQueryCity(event.target.value);
  //   getHospitals();
  // };

  // const handleSearchStateCodeChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setSearchQueryStateCode(event.target.value);
  //   getHospitals();
  // };
  // const handleSearchCountryCodeChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setSearchQueryCountryCode(event.target.value);
  //   getHospitals();
  // };
  // const handleSearchPostalCodeChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setSearchQueryPostalCode(event.target.value);
  //   getHospitals();
  // };

  // //Building Update OpenModal

  // const handleEditClick = (hospitalId: number) => {
  //   const selectedHospital: ViewHospital | undefined = activeHospitals.find(
  //     (hospital) => hospital.id === hospitalId
  //   );

  //   if (selectedHospital) {
  //     setEditData(selectedHospital);
  //     console.log(selectedHospital);
  //     setSelectedHospitalId(hospitalId);
  //     navigate(`/hospitals/${hospitalId}/edit`);
  //   }
  // };

  // // // Function to open the delete confirmation modal
  // // const openDeleteModal = (hospitalId: number) => {
  // //   const selectedHospital: ViewHospital | undefined = activeHospitals.find(
  // //     (hospital) => hospital.id === hospitalId
  // //   );

  // //   if (selectedHospital) {
  // //     setHospitalToDeleteId(hospitalId);
  // //     setDeleteData(selectedHospital)
  // //     setIsDeleteModalOpen(true);
  // //   }
  // // };

  // // Function to open the delete confirmation modal
  // const openDeleteModal = (
  //   hospital: { id: number; isActive: boolean | undefined } | null
  // ) => {
  //   const selectedHospital: ViewHospital | undefined = activeHospitals.find(
  //     (hospitals) => hospitals.id === hospital?.id
  //   );

  //   console.log(selectedHospital, 'select');
  //   if (selectedHospital) {
  //     setHospitalToDeleteId(hospital);
  //     setDeleteData(selectedHospital);
  //     setIsDeleteModalOpen(true);
  //   }
  // };
  // // Function to close the delete confirmation modal
  // const closeDeleteModal = () => {
  //   setHospitalToDeleteId(null);
  //   setIsDeleteModalOpen(false);
  // };

  // const handleChangePage = (event: any, newPage: number) => {
  //   console.log('Page changed to:', newPage);
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event: any) => {
  //   const newRowsPerPage = parseInt(
  //     event.target.value
  //     // activeBuildingFlats.length
  //   );
  //   console.log('Rows per page changed to:', newRowsPerPage);
  //   setRowsPerPage(newRowsPerPage);
  //   setPage(0);
  //   setRowsPerPage(newRowsPerPage);
  //   getHospitals();
  // };

  // const pageCountThreshold = totalItems;

  // const pageCount = Math.ceil(totalItems / rowsPerPage);

  // // Edit Hospital

  // const handleUpdate = async (updatedData: AddHospital) => {
  //   try {
  //     const response = await axios.put(
  //       `${apiUrl}/hospitals/${selectedHospitalId}`,
  //       updatedData,
  //       {
  //         withCredentials: true,
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     console.log(response.data);

  //     if (response.data) {
  //       console.log('Hospital Updated Successfully');
  //       enqueueSnackbar('Hospital updated successfully!', {
  //         variant: 'success',
  //       });
  //       getHospitals();
  //       setIsModalOpen(false);
  //     } else {
  //       console.log('Update data not received');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     enqueueSnackbar('Something went wrong', { variant: 'error' });
  //     console.log('Something went wrong');
  //   }
  // };

  // //delete Hospital

  // const handleDelete = async (Id: any) => {
  //   try {
  //     const { data } = await axios.delete(`${apiUrl}/hospitals/${Id}`, {
  //       withCredentials: true,
  //     });
  //     console.log(data);
  //     enqueueSnackbar('Hospital deleted successfully!', { variant: 'success' });
  //     console.log('Hospital DeActive successfully');
  //     getHospitals();
  //   } catch (error) {
  //     console.log(error);
  //     enqueueSnackbar('Something went wrong', { variant: 'error' });
  //     console.log('Something went wrong');
  //   }
  // };

  const apiUrl = environment.apiUrl;
  const [activeHospitals, setActiveHospitals] = useState<
    ViewHospital[]
  >([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQueryName, setSearchQueryName] = useState<string>('');
  const [searchQueryCity, setSearchQueryCity] = useState<string>('');
  const [searchQueryStateCode, setSearchQueryStateCode] = useState<string>('');
  const [searchQueryCountryCode, setSearchQueryCountryCode] =
    useState<string>('');
  const [searchQueryPostalCode, setSearchQueryPostalCode] =
    useState<string>('');
  const navigate = useNavigate();
  const [actives, setActives] = useState<boolean>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState<
    number | null
  >(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [HospitalToDeleteId, setHospitalToDeleteId] = useState<{
    id: number;
    isActive: boolean | undefined;
  } | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  const [editData, setEditData] = useState<ViewHospital | null>(null);
  const [deleteData, setDeleteData] = useState<ViewHospital | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const getHospitals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/hospitals`, {
        withCredentials: true,
        params: {
          pageSize: rowsPerPage,
          pageOffset: page - 1,
          name: searchQueryName,
          city: searchQueryCity,
          stateCode: searchQueryStateCode,
          countryCode: searchQueryCountryCode,
          postalCode: searchQueryPostalCode,
        },
      });

      const { content, total } = response.data;
      setTotalItems(total);
      setActiveHospitals(content);
      console.log(content);
      setLoading(false);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
      setLoading(false);
    }
  }, [
    apiUrl,
    rowsPerPage,
    page,
    searchQueryName,
    searchQueryCity,
    searchQueryStateCode,
    searchQueryCountryCode,
    searchQueryPostalCode,
  ]);

  useEffect(() => {
    getHospitals();
  }, [
    page,
    rowsPerPage,
    searchQueryName,
    searchQueryCity,
    searchQueryStateCode,
    searchQueryPostalCode,
    searchQueryCountryCode,
    getHospitals,
  ]);

  const handleFilterChange = () => {
    setPage(1);
  };

  useEffect(() => {
    handleFilterChange();
  }, [
    searchQueryName,
    searchQueryCity,
    searchQueryStateCode,
    searchQueryPostalCode,
    searchQueryCountryCode,
  ]);

  // Add Building

  const handleAddHospital = async (newData: AddHospital) => {
    try {
      const { data: responseData } = await axios.post(
        `${apiUrl}/hospitals`,
        newData,
        {
          withCredentials: true,
        }
      );
      if (responseData) {
        enqueueSnackbar('Hospital added successfully!', {
          variant: 'success',
        });
        setIsAddModalOpen(false);
        getHospitals();
      } else {
        console.log('Something went wrong');
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
      console.log('Something went wrong in input form');
    }
  };

  //Building Update CloseModal

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedHospitalId(null);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedHospitalId(null);
  };

  const handleSearchNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQueryName(event.target.value);
    getHospitals();
  };

  const handleSearchCityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQueryCity(event.target.value);
    getHospitals();
  };

  const handleSearchStateCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQueryStateCode(event.target.value);
    getHospitals();
  };
  const handleSearchCountryCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQueryCountryCode(event.target.value);
    getHospitals();
  };
  const handleSearchPostalCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQueryPostalCode(event.target.value);
    getHospitals();
  };

  //Building Update OpenModal

  const handleEditClick = (hospitalId: number) => {
    const selectedHospital: ViewHospital | undefined =
      activeHospitals.find(
        (hospital) => hospital.id === hospitalId
      );

    if (selectedHospital) {
      setEditData(selectedHospital);
      console.log(selectedHospital);
      setSelectedHospitalId(hospitalId);
      setIsEditModalOpen(true);
      // navigate
      //   (`/hospitals/${hospitalId}/edit`)
    }
  };

  // Function to open the delete confirmation modal
  const openDeleteModal = (
    hospital: { id: number; isActive: boolean | undefined } | null
  ) => {
    const selectedHospital: ViewHospital | undefined =
      activeHospitals.find(
        (hospitals) => hospitals.id === hospital?.id
      );

    console.log(selectedHospital, 'select');
    if (selectedHospital) {
      setHospitalToDeleteId(hospital);
      setDeleteData(selectedHospital);
      setIsDeleteModalOpen(true);
    }
  };

  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setHospitalToDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  const handleChangePage = (event: any, newPage: number) => {
    console.log('Page changed to:', newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    const newRowsPerPage = parseInt(
      event.target.value
      // activeBuildingFlats.length
    );
    console.log('Rows per page changed to:', newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setRowsPerPage(newRowsPerPage);
    getHospitals();
  };

  const pageCountThreshold = totalItems;

  const pageCount = Math.ceil(totalItems / rowsPerPage);

  // Edit Hospital

  const handleUpdate = async (updatedData: AddHospital) => {
    try {
      const response = await axios.put(
        `${apiUrl}/hospitals/${selectedHospitalId}`,
        updatedData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response.data);

      if (response.data) {
        console.log('Hospital Updated Successfully');
        enqueueSnackbar('Hospital updated successfully!', {
          variant: 'success',
        });
        getHospitals();
        setIsModalOpen(false);
      } else {
        console.log('Update data not received');
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
      console.log('Something went wrong');
    }
  };

  //delete Hospital

  const handleDelete = async (
    hospital: { id: number; isActive: boolean | undefined } | null
  ) => {
    try {
      const { data } = await axios.put(
        `${apiUrl}/hospitals/${hospital?.id}/status`,
        { isActive: !hospital?.isActive },
        {
          withCredentials: true,
        }
      );
      console.log(data);
      // enqueueSnackbar("hospital deleted successfully!", { variant: 'success' });
      enqueueSnackbar(
        `User ${
          hospital?.isActive === false ? 'activated' : 'deactivated'
        } successfully!`,
        { variant: 'success' }
      );
      console.log('Hospital DeActive successfully');
      getHospitals();
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
      console.log('Something went wrong');
    }
  };

  const getCountryName = (countryCode: string) => {
    const country = CountriesStates.find((c) => c.code === countryCode);
    return country ? country.name : '';
  };

  const getStateName = (stateCode: string) => {
    for (const country of CountriesStates) {
      const state = country.states.find((s) => s.code === stateCode);
      console.log('state', state);
      if (state) {
        return state.name;
      }
    }
    return '';
  };

  const handleCheckboxChange = (hospitalId: number) => {
    const isSelected = selectedItems.includes(hospitalId);
    if (isSelected) {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== hospitalId)
      );
    } else {
      setSelectedItems((prevSelected) => [...prevSelected, hospitalId]);
    }
  };

  const handleHeaderCheckboxChange = () => {
    const allSelected = activeHospitals.every((hospital) =>
      selectedItems.includes(hospital.id)
    );

    if (allSelected) {
      setSelectedItems([]);
    } else {
      const allHospitalIds = activeHospitals.map((hospital) => hospital.id);
      setSelectedItems(allHospitalIds);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    uploadFileToAPI(file);
  };

  const uploadFileToAPI = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${apiUrl}/hospitals/bulkupload`,
        formData,
        {
          withCredentials: true,
        }
      );
      if (response) {
        enqueueSnackbar('Excel file successfully!', { variant: 'success' });
        getHospitals();
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

  // const handleExport = async () => {
  //   try {
  //     const response = await axios.get(`${apiUrl}/hospitals`, {
  //       withCredentials: true});
  //     const hospitalsData = response.data.content;

  //     const exportData = convertDataToCSV(hospitalsData);

  //     const blob = new Blob([exportData], { type: 'text/csv' });

  //     const a = document.createElement('a');
  //     a.href = URL.createObjectURL(blob);
  //     a.download = 'exported_data.csv';
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //   } catch (error) {
  //     console.error('Error fetching data from API:', error);
  //   }
  // };

  // const convertDataToCSV = (data: Record<string, string>[]) => {
  //   if (!data.length) {
  //     return '';
  //   }
  //   const header = Object.keys(data[0]).join(',') + '\n';
  //   const rows = data.map((row) => Object.values(row).join(',') + '\n');
  //   return header + rows.join('');
  // };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${apiUrl}/hospitals`, {
        withCredentials: true,
      });
      const hospitalsData = response.data.content;
      const excludedFields = ['id', 'isActive'];
      const exportData = convertDataToExcel(hospitalsData, excludedFields);

      const blob = new Blob([exportData], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'exported_hospital_data.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };

  const convertDataToExcel = (
    data: Record<string, any>[],
    excludedFields: string[]
  ) => {
    if (!data.length) {
      return new ArrayBuffer(0);
    }

    const filteredData = data.map((row) =>
      Object.keys(row).reduce((acc, key) => {
        if (!excludedFields.includes(key)) {
          acc[key] = row[key];
        }
        return acc;
      }, {} as Record<string, any>)
    );

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
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

  const breadcrumbs = [
    // {
    //   to: '/home',
    //   label: 'Home',
    // },
    {
      label: 'Hospitals',
    },
  ];

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  return (
    <Box className={styles['container']}>
      <CustomBreadcrumbs paths={breadcrumbs} />
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              mt: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h1 style={{ marginTop: '10px' }}>Hospitals</h1>
            <TextField
              type="text"
              // label="Search by Hospital Name"
              sx={{ mr: '10px', ml: '10px' }}
              size="small"
              variant="outlined"
              onChange={handleSearchNameChange}
              InputProps={{
                startAdornment: <SearchIcon color="action" />,
              }}
            />
          </Box>

           <Box> 
          <AddHospitalComponent
              open={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSubmit={handleAddHospital}
            /> 
          </Box> 
          {/* <Box className={styles['search-container']}>
            <Button
              startIcon={<FileUploadIcon />}
              color="info"
              variant="contained"
              onClick={handleExport}
            >
              Export
            </Button>
            <input
              type="file"
              id="excel-file-input"
              accept=".xls, .xlsx"
              style={{ display: 'none' }}
              onChange={handleImport}
            />
            <Button
              startIcon={<DownloadIcon />}
              color="info"
              variant="contained"
              onClick={() => document.getElementById('excel-file-input')?.click()}
            >
              Import
            </Button>
            <TextField
              type="text"
              // label="Search by Hospital Name"
              sx={{ mt: 2.3, mr: "10px" }}
              variant="outlined"
              size="small"
              onChange={handleSearchNameChange}
              InputProps={{
                startAdornment: (
                  <SearchIcon color="action" />
                ),
              }}
            /> */}
          <Button
            variant="contained"
            color="primary"
            // onClick={() => navigate('/hospitals/add')}
            onClick={() => {
              setIsAddModalOpen(true);
            }}
          >
            <AddIcon fontSize="small" /> Add
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'black' }}>
            <TableRow>
              <TableCell>
                <Checkbox
                  {...label}
                  checked={
                    activeHospitals.length > 0 &&
                    activeHospitals.every((hospital) =>
                      selectedItems.includes(hospital.id)
                    )
                  }
                  onChange={handleHeaderCheckboxChange}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Postal Code</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow></TableRow>
            {loading ? (
              <TableCell align='center' colSpan={8}>
                <CircularProgress />
              </TableCell>
            ) : Array.isArray(activeHospitals) && activeHospitals.length > 0 ? (
              activeHospitals.map((hospital: ViewHospital, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(hospital.id)}
                      onChange={() => handleCheckboxChange(hospital.id)}
                      {...label}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <NavLink
                      to={`/hospitals/${hospital.id}`}
                      className={styles['socname']}
                    >
                      {hospital.name}
                    </NavLink>
                  </TableCell>
                  <TableCell>
                    {hospital.addressLine1}, {hospital.addressLine2}
                  </TableCell>

                  <TableCell>{hospital.city}</TableCell>
                  <TableCell>
                        {getStateName(hospital.stateCode)}
                      </TableCell>
                      <TableCell>
                        {getCountryName(hospital.countryCode)}
                      </TableCell>
                  <TableCell>{hospital.postalCode}</TableCell>
                  <TableCell sx={{ minWidth: 70 }}>
                    <IconButton
                      aria-label="edit"
                      sx={{ color: 'black' }}
                      onClick={() => handleEditClick(hospital.id)}
                    >
                      <EditIcon color="primary">{/* Edit */}</EditIcon>
                    </IconButton>
                    {hospital.isActive ? (
                      <IconButton
                        aria-label="edit"
                        color="error"
                        onClick={() =>
                          // handleDelete(building.id)
                          openDeleteModal({
                            id: hospital.id,
                            isActive: hospital.isActive,
                          })
                        }
                      >
                        <BlockIcon>Delete</BlockIcon>
                      </IconButton>
                    ) : (
                      <IconButton
                        aria-label="edit"
                        color="error"
                        onClick={() =>
                          // handleDelete(building.id)
                          openDeleteModal({
                            id: hospital.id,
                            isActive: hospital.isActive,
                          })
                        }
                      >
                        <RadioButtonCheckedIcon color="success">
                          Delete
                        </RadioButtonCheckedIcon>
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={10}>
                  No Hospital found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: "flex-end",

          }}>
            <Stack sx={{ marginBottom: "15px", marginRight: "20px", marginTop: "30px", }} spacing={2}>
              <Pagination
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: "flex-end",

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
          </Box> */}
      </TableContainer>
      <Stack spacing={2} className={styles['paginationContainer']}>
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
      </Stack>
      {/* </Box> */}

      <EditHospitalComponent
        open={isEditModalOpen}
        onClose={closeEditModal}
        onUpdate={(data) => {
          handleUpdate(data);
          closeEditModal();
        }}
        initialData={editData}
      />

      <DeleteHospitalComponent
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={() => {
          handleDelete(HospitalToDeleteId);
          closeDeleteModal();
        }}
        hospitalData={deleteData}
      />
    </Box>
  );
}

export default ListHospitals;
