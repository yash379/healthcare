import styles from './delete-hospital.module.scss';
import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { AddHospital } from '@healthcare/data-transfer-types';


export interface DeleteHospitalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  hospitalData: AddHospital | null;
}

const DeleteHospitalComponent: React.FC<DeleteHospitalProps> = ({
  open,
  onClose,
  onDelete,
  hospitalData
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['edit_modal_container']}>
        <h2 className={styles['h2_tag']}>Delete Hospital</h2>
        <p>Are you sure you want to delete <b>{hospitalData?.name}</b> hospital?</p>
        <Box className={styles['modal-buttons']}>
         
          <Button variant="contained" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
          className={styles['delete_btn']}
            variant="contained"
            color="error"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default DeleteHospitalComponent;
