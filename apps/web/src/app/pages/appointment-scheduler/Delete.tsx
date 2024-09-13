// DeleteConfirmationModal.tsx  
import React from 'react';  
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, IconButton } from '@mui/material';  
import CancelIcon from '@mui/icons-material/Cancel';  

interface Props {  
    open: boolean;  
    onClose: () => void;  
    onConfirm: () => void;  
}  

const DeleteConfirmationModal: React.FC<Props> = ({ open, onClose, onConfirm }) => {  
    return (  
        <Dialog  
            open={open}  
            onClose={onClose}  
        >  
            <DialogTitle>  
                Confirm Delete  
                <IconButton  
                    edge="end"  
                    color="inherit"  
                    onClick={onClose}  
                    aria-label="close"  
                    style={{ position: 'absolute', right: 25, top: 8, color: '#323232' }}  
                >  
                    <CancelIcon />  
                </IconButton>  
            </DialogTitle>  
            <DialogContent>  
                <DialogContentText>  
                    Are you sure you want to delete this Appointment?  
                </DialogContentText>  
            </DialogContent>  
            <DialogActions>  
                <Button onClick={onClose} sx={{ color: 'black' }}>  
                    Cancel  
                </Button>  
                <Button onClick={onConfirm} sx={{ color: 'white', backgroundColor: '#E93F3F' }}>  
                    Delete  
                </Button>  
            </DialogActions>  
        </Dialog>  
    );  
};  

export default DeleteConfirmationModal;