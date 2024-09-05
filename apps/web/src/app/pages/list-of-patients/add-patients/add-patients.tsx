import styles from './add-patients.module.scss';
import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import CancelIcon from '@mui/icons-material/Cancel';
import { Patient } from '../list-patients/list-patients';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export interface AddPatientsProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Patient) => void;
    control: any;
    handleSubmit: any;
}

export function AddPatients({ open, onClose, onSubmit, control, handleSubmit }: AddPatientsProps){
    const submitData = (data: any) => {
        onSubmit(data);
    };


    return (
        <Dialog open={open} onClose={onClose} className="add-dialog">
            <DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    style={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CancelIcon style={{ color: '#323232' }} />
                </IconButton>
                Add Appointment
            </DialogTitle>
            <DialogContent style={{ display: 'flex', borderRadius: '50px' }}>
                <form onSubmit={handleSubmit(submitData)}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                margin="dense"
                                label="Name"
                                type="text"
                                fullWidth
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                className="input-field"
                            />
                        )}
                    />
                    <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                margin="dense"
                                label="Email"
                                type="email"
                                fullWidth
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                className="input-field"
                            />
                        )}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Controller
                                name="gender"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <FormControl fullWidth margin="dense">
                                        <InputLabel>Gender</InputLabel>
                                        <Select
                                            {...field}
                                            label="Gender"
                                            error={!!fieldState.error}
                                        >
                                            <MenuItem value="Male">Male</MenuItem>
                                            <MenuItem value="Female">Female</MenuItem>
                                        </Select>
                                        {fieldState.error && (
                                            <p style={{ color: 'red', fontSize: '0.75rem' }}>{fieldState.error.message}</p>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <FormControl fullWidth margin="dense">
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            {...field}
                                            label="Status"
                                            error={!!fieldState.error}
                                        >
                                            <MenuItem value="Active">Active</MenuItem>
                                            <MenuItem value="Inactive">Inactive</MenuItem>
                                        </Select>
                                        {fieldState.error && (
                                            <p style={{ color: 'red', fontSize: '0.75rem' }}>{fieldState.error.message}</p>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Controller
                        name="age"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                margin="dense"
                                label="Age"
                                type="number"
                                fullWidth
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                className="input-field"
                            />
                        )}
                    />
                    <Box mt={2}>
                        <Controller
                            name="date"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    margin="dense"
                                    label="Date"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiInputBase-root': { borderBottom: 'none' },
                                        '& .MuiInputLabel-root': { color: '#347E7D' },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#347E7D' },
                                            '&:hover fieldset': { borderColor: '#347E7D' },
                                            '&.Mui-focused fieldset': { borderColor: '#347E7D' },
                                        },
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name="visitTime"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    margin="dense"
                                    label="Visit Time"
                                    type="time"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiInputBase-root': { borderBottom: 'none' },
                                        '& .MuiInputLabel-root': { color: '#347E7D' },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#347E7D' },
                                            '&:hover fieldset': { borderColor: '#347E7D' },
                                            '&.Mui-focused fieldset': { borderColor: '#347E7D' },
                                        },
                                    }}
                                />
                            )}
                        />
                    </Box>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Button type="submit" sx={{ backgroundColor: '#347E7D', color: 'white' }} className="add-button">
                            Add Appointment
                        </Button>
                        <Button onClick={onClose} sx={{ color: '#347E7D' }} className="cancel-button">
                            CANCEL
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddPatients;
