import { Box, Button, Dialog, DialogTitle, MenuItem, Modal, TextField } from '@mui/material';
import styles from './add-appointment.module.scss';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { useEffect } from 'react';
import { Gender } from '@prisma/client';

export enum GenderEnum {
  female = "female",
  male = "male",
  other = "other",
}


export interface Form {
  firstName: string
  lastName: string
  mobileNumber: string
  email: string
  gender: Gender
  age: number
  date: Date
}
/* eslint-disable-next-line */
export interface AddAppointmentProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Form) => void;
}

const AddAppointment: React.FC<AddAppointmentProps> = ({ open, onClose, onSubmit }) => {


  const validationSchema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    mobileNumber: yup.string().required('Mobile Number is required'),
    email: yup.string().required('Email is required'),
    gender: yup.string().required('Gender is required'),
    age: yup.number().required('Age is required'),
    date: yup.date().required('Date is Required')
  });

  const { handleSubmit, control, reset, formState: { errors }, watch, setValue } = useForm<Form>({
    resolver: yupResolver(validationSchema),

  });

  const handleFormSubmit = (data: Form) => {
    console.log("handleAddForm:", data)
    onSubmit(data);
  };

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  return (
    // <Modal open={open} onClose={onClose}>
    //   <Box className={styles['modal-container']}
    //     sx={{
    //       position: 'absolute',
    //       top: '45%',
    //       marginBottom: 100,
    //       left: '50%',
    //       transform: 'translate(-50%, -50%)',
    //       width: '100%',
    //       maxWidth: 500,
    //       maxHeight: 440,
    //       bgcolor: 'white', // White background
    //       boxShadow: 24,
    //       p: 4,
    //       borderRadius: 2,

    //     }}
    //   >
    //     <h2 className={styles['h2_tag']}>Add Appointment</h2>
    //     <form onSubmit={handleSubmit(handleFormSubmit)}>
    //       <Box sx={{
    //         // display: 'grid',
    //         columnGap: 5,
    //         rowGap: 2,
    //         paddingRight: 1,
    //         paddingLeft: 1,
    //         gridTemplateColumns: 'repeat(2, 1fr)',
    //         '@media (max-width: 600px)': {
    //           gridTemplateColumns: '1fr',
    //         },
    //       }}>
    //         <Box className={styles['modal_first_container']}>
    //           <Box className={styles['grid_top']}>
    //             <Controller
    //               name="firstName"
    //               control={control}
    //               defaultValue=""
    //               rules={{ required: 'First Name is required' }}
    //               render={({ field }) => (
    //                 <TextField sx={{
    //                   marginBottom: 1,
    //                   '& .MuiInputBase-root': {
    //                     height: 40, // Adjust height here
    //                   },
    //                   '& .MuiInputBase-input': {
    //                     padding: '10px 14px', // Adjust padding to fit height
    //                     fontSize: '0.875rem', // Adjust font size if needed
    //                   },
    //                   '& .MuiInputLabel-root': {
    //                     fontSize: '0.75rem', // Adjust label font size if needed
    //                     top: -6, // Adjust label position if needed
    //                   },
    //                 }}
    //                   type="text"
    //                   fullWidth
    //                   className="form-control"
    //                   placeholder="Enter First Name"
    //                   {...field}
    //                   label="First Name*"
    //                   error={!!errors.firstName}
    //                   helperText={errors.firstName?.message}
    //                 />

    //               )}
    //             />
    //           </Box>
    //           <Box className={styles['grid_top']}>
    //             <Controller
    //               name="lastName"
    //               control={control}
    //               defaultValue=""
    //               rules={{ required: 'Lst Name is required' }}
    //               render={({ field }) => (
    //                 <TextField sx={{
    //                   marginBottom: 1,
    //                   '& .MuiInputBase-root': {
    //                     height: 40, // Adjust height here
    //                   },
    //                   '& .MuiInputBase-input': {
    //                     padding: '10px 14px', // Adjust padding to fit height
    //                     fontSize: '0.875rem', // Adjust font size if needed
    //                   },
    //                   '& .MuiInputLabel-root': {
    //                     fontSize: '0.75rem', // Adjust label font size if needed
    //                     top: -6, // Adjust label position if needed
    //                   },
    //                 }}
    //                   type="text"
    //                   fullWidth
    //                   className="form-control"
    //                   placeholder="Enter First Name"
    //                   {...field}
    //                   label="Last Name*"
    //                   error={!!errors.lastName}
    //                   helperText={errors.lastName?.message}
    //                 />

    //               )}
    //             />
    //           </Box>
    //           <Box className={styles['grid_top']}>
    //             <Controller
    //               name="mobileNumber"
    //               control={control}
    //               defaultValue=""
    //               rules={{ required: 'Mobile Number is required' }}
    //               render={({ field }) => (
    //                 <TextField sx={{
    //                   marginBottom: 1,
    //                   '& .MuiInputBase-root': {
    //                     height: 40, // Adjust height here
    //                   },
    //                   '& .MuiInputBase-input': {
    //                     padding: '10px 14px', // Adjust padding to fit height
    //                     fontSize: '0.875rem', // Adjust font size if needed
    //                   },
    //                   '& .MuiInputLabel-root': {
    //                     fontSize: '0.75rem', // Adjust label font size if needed
    //                     top: -6, // Adjust label position if needed
    //                   },
    //                 }}
    //                   type="text"
    //                   fullWidth
    //                   className="form-control"
    //                   placeholder="Enter Mobile number"
    //                   {...field}
    //                   label="Mobile Number*"
    //                   error={!!errors.mobileNumber}
    //                   helperText={errors.mobileNumber?.message}
    //                 />

    //               )}
    //             />
    //           </Box>
    //           <Box className={styles['grid_top']}>
    //             <Controller
    //               name="email"
    //               control={control}
    //               defaultValue=""
    //               rules={{ required: 'Email is required' }}
    //               render={({ field }) => (
    //                 <TextField sx={{
    //                   marginBottom: 1,
    //                   '& .MuiInputBase-root': {
    //                     height: 40, // Adjust height here
    //                   },
    //                   '& .MuiInputBase-input': {
    //                     padding: '10px 14px', // Adjust padding to fit height
    //                     fontSize: '0.875rem', // Adjust font size if needed
    //                   },
    //                   '& .MuiInputLabel-root': {
    //                     fontSize: '0.75rem', // Adjust label font size if needed
    //                     top: -6, // Adjust label position if needed
    //                   },
    //                 }}
    //                   type="text"
    //                   fullWidth
    //                   className="form-control"
    //                   placeholder="Enter Email"
    //                   {...field}
    //                   label="Email*"
    //                   error={!!errors.email}
    //                   helperText={errors.email?.message}
    //                 />

    //               )}
    //             />
    //           </Box>
    //           <Box sx={{
    //             display:'flex',

    //           }}>
    //             <Box className={styles['grid_top']}>
    //               <Controller
    //                 name="gender"
    //                 control={control}
    //                 rules={{ required: 'gender is required' }}
    //                 render={({ field }) => (
    //                   <TextField sx={{
    //                     marginBottom: 1,
    //                     '& .MuiInputBase-root': {
    //                       height: 50, // Adjust height here
    //                     },
    //                     '& .MuiInputBase-input': {
    //                       padding: '10px 14px', // Adjust padding to fit height
    //                       fontSize: '1rem', // Adjust font size if needed
    //                     },
    //                     '& .MuiInputLabel-root': {
    //                       fontSize: '1rem', // Adjust label font size if needed
    //                       top: -6, // Adjust label position if needed
    //                     },
    //                   }}
    //                     type="text"
    //                     fullWidth
    //                     className="form-control"
    //                     placeholder="Enter gender"
    //                     {...field}
    //                     label="gender*"
    //                     error={!!errors.gender}
    //                     helperText={errors.gender?.message}
    //                   />

    //                 )}
    //               />
    //             </Box>
    //             <Box className={styles['grid_top']}>
    //               <Controller
    //                 name="age"
    //                 control={control}
    //                 rules={{ required: 'age is required' }}
    //                 render={({ field }) => (
    //                   <TextField sx={{
    //                     marginBottom: 1,
    //                     marginLeft:2,
    //                     '& .MuiInputBase-root': {
    //                       height: 50, // Adjust height here
    //                     },
    //                     '& .MuiInputBase-input': {
    //                       padding: '10px 14px', // Adjust padding to fit height
    //                       fontSize: '1rem', // Adjust font size if needed
    //                     },
    //                     '& .MuiInputLabel-root': {
    //                       fontSize: '1rem', // Adjust label font size if needed
    //                       top: -6, // Adjust label position if needed
    //                     },
    //                   }}
    //                     type="text"
    //                     fullWidth
    //                     className="form-control"
    //                     placeholder="Enter age"
    //                     {...field}
    //                     label="age*"
    //                     error={!!errors.age}
    //                     helperText={errors.age?.message}
    //                   />

    //                 )}
    //               />
    //             </Box>
    //           </Box>

    //           <Box className={styles['grid_top']}>
    //             <LocalizationProvider dateAdapter={AdapterDayjs}>
    //               <DemoContainer components={['DatePicker']}>
    //                 <DatePicker label="Basic date picker"
    //                   sx={{
    //                     '& .MuiInputBase-root': {
    //                       height: 40, // Adjust height here
    //                     },
    //                   }}
    //                 />
    //               </DemoContainer>
    //             </LocalizationProvider>
    //           </Box>
    //         </Box>

    //       </Box>

    //       <Box className={styles['update_modal-buttons']}>
    //         <Button sx={{ mr: "10px" }} variant="contained" color="primary" type="submit">
    //           Add
    //         </Button>
    //         <Button variant="contained" color="secondary" onClick={() => { onClose(); reset() }}>
    //           Cancel
    //         </Button>
    //       </Box>



    //     </form>
    //   </Box>
    // </Modal>









    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className={styles['h2_tag']}>Add Appointment</DialogTitle>
      <Box className={styles['modal-container']}
        sx={{
          padding: 4,
        }}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box sx={{
            columnGap: 5,
            rowGap: 2,
            paddingRight: 1,
            paddingLeft: 1,
            gridTemplateColumns: 'repeat(2, 1fr)',
            '@media (max-width: 600px)': {
              gridTemplateColumns: '1fr',
            },
          }}>
            <Box className={styles['modal_first_container']}>
              <Box className={styles['grid_top']}>
                <Controller
                  name="firstName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField sx={{
                      marginBottom: 1,
                      '& .MuiInputBase-root': {
                        height: 40,
                      },
                      '& .MuiInputBase-input': {
                        padding: '10px 14px',
                        fontSize: '0.875rem',
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '0.75rem',
                        top: -6,
                      },
                    }}
                      type="text"
                      fullWidth
                      placeholder="Enter First Name"
                      {...field}
                      label="First Name*"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  )}
                />
              </Box>
                <Box className={styles['modal_first_container']}>
                  {/* Last Name Field */}
                  <Box className={styles['grid_top']}>
                    <Controller
                      name="lastName"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          sx={{
                            marginBottom: 1,
                            '& .MuiInputBase-root': {
                              height: 40,
                            },
                            '& .MuiInputBase-input': {
                              padding: '10px 14px',
                              fontSize: '0.875rem',
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.75rem',
                              top: -6,
                            },
                          }}
                          type="text"
                          fullWidth
                          placeholder="Enter Last Name"
                          {...field}
                          label="Last Name*"
                          error={!!errors.lastName}
                          helperText={errors.lastName?.message}
                        />
                      )}
                    />
                  </Box>

                  {/* Mobile Number Field */}
                  <Box className={styles['grid_top']}>
                    <Controller
                      name="mobileNumber"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          sx={{
                            marginBottom: 1,
                            '& .MuiInputBase-root': {
                              height: 40,
                            },
                            '& .MuiInputBase-input': {
                              padding: '10px 14px',
                              fontSize: '0.875rem',
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.75rem',
                              top: -6,
                            },
                          }}
                          type="text"
                          fullWidth
                          placeholder="Enter Mobile Number"
                          {...field}
                          label="Mobile Number*"
                          error={!!errors.mobileNumber}
                          helperText={errors.mobileNumber?.message}
                        />
                      )}
                    />
                  </Box>

                  {/* Email Field */}
                  <Box className={styles['grid_top']}>
                    <Controller
                      name="email"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          sx={{
                            marginBottom: 1,
                            '& .MuiInputBase-root': {
                              height: 40,
                            },
                            '& .MuiInputBase-input': {
                              padding: '10px 14px',
                              fontSize: '0.875rem',
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.75rem',
                              top: -6,
                            },
                          }}
                          type="text"
                          fullWidth
                          placeholder="Enter Email"
                          {...field}
                          label="Email*"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                        />
                      )}
                    />
                  </Box>

                  {/* Gender Field */}
                  <Box sx={{ display: 'flex' ,justifyContent:'space-between'}}>
                    <Box className={styles['grid_top']}>
                      <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            select
                            sx={{
                              marginBottom: 1,
                              '& .MuiInputBase-root': {
                                height: 50,
                              },
                              '& .MuiInputBase-input': {
                                padding: '10px 55px',
                                fontSize: '1rem',
                              },
                              '& .MuiInputLabel-root': {
                                fontSize: '1rem',
                                top: -6,
                              },
                            }}
                            fullWidth
                            {...field}
                            label="Gender*"
                            error={!!errors.gender}
                            helperText={errors.gender?.message}
                          >
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </TextField>
                        )}
                      />
                    </Box>

                    {/* Age Field */}
                    <Box className={styles['grid_top']}>
                      <Controller
                        name="age"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            sx={{
                              marginBottom: 1,
                              marginLeft: 2,
                              '& .MuiInputBase-root': {
                                height: 50,
                              },
                              '& .MuiInputBase-input': {
                                padding: '10px 14px',
                                fontSize: '1rem',
                              },
                              '& .MuiInputLabel-root': {
                                fontSize: '1rem',
                                top: -6,
                              },
                            }}
                            type="number"
                            fullWidth
                            placeholder="Enter Age"
                            {...field}
                            label="Age*"
                            error={!!errors.age}
                            helperText={errors.age?.message}
                          />
                        )}
                      />
                    </Box>
                  </Box>

                  {/* Date Picker Field */}
                </Box>
                <Box className={styles['grid_top']}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker label="Basic date picker"
                        sx={{
                          '& .MuiInputBase-root': {
                            height: 40,
                          },
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Box>
            </Box>
          </Box>

          <Box className={styles['update_modal-buttons']}>
            <Button sx={{ mr: "10px" }} variant="contained" color="primary" type="submit">
              Add
            </Button>
            <Button variant="contained" color="secondary" onClick={() => { onClose(); reset(); }}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Dialog>
  );
}

export default AddAppointment;
