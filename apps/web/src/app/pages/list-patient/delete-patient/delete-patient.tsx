import styles from './delete-patient.module.scss';
import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Gender } from '@prisma/client';


export interface DeletePatientProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  patientData: EditForm | null;
}


interface EditForm {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  gender: Gender;
  bloodgroup: string;
  dob: Date;
  digitalHealthCode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  isActive: boolean;
}

const DeletePatientComponent: React.FC<DeletePatientProps> = ({
  open,
  onClose,
  onDelete,
  patientData
}) => {


  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['delete_modal_container']}>
        {/* <h2 className={styles['h2_tag']}>Delete Patient</h2> */}
        <p>Are you sure you want to delete patient <b>{patientData?.firstName + ' ' + patientData?.lastName}</b>?</p>
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

export default DeletePatientComponent;
