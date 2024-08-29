import styles from './edit-appointment.module.scss';
import { GenderEnum } from '../add-appointment/add-appointment';
import { Form } from '../add-appointment/add-appointment';
import * as yup from 'yup';
import { Modal } from '@mui/material';

/* eslint-disable-next-line */
export interface EditAppointmentProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Form) => void;
}

const EditAppointment: React.FC<EditAppointmentProps> =  ({ open, onClose, onSubmit }) =>{


  const validationSchema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    mobileNumber: yup.string().required('Mobile Number is required'),
    email: yup.string().required('Email is required'),
    gender: yup.string().required('Gender is required'),
    age: yup.number().required('Age is required'),
    date: yup.date().required('Date is Required')
  });


  return (
    <Modal 
    open={open}
    onClose={onclose}
    >
      
    </Modal>
  );
}

export default EditAppointment;
