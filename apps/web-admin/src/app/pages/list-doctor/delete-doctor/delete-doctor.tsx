import styles from './delete-doctor.module.scss';
import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Gender } from '@prisma/client';


export interface DeleteDoctorProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  doctorData: EditForm | null;
}


interface EditForm {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  phoneNumber: string;
  doctorCode: string;
  speciality: string;
  isActive: boolean;
}

const DeleteDoctorComponent: React.FC<DeleteDoctorProps> = ({
  open,
  onClose,
  onDelete,
  doctorData
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['delete_modal_container']}>
        {/* <h2 className={styles['h2_tag']}>Delete Doctor</h2> */}
        <p>Are you sure you want to delete doctor <b>{doctorData?.firstName + ' ' + doctorData?.lastName}</b>?</p>
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

export default DeleteDoctorComponent;
