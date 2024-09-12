import { Page } from './page';

export interface Prescription {
  id: number; // ID of the prescription
  doctorId: number;
  patientId: number;
  prescriptionDate: string; // Date in ISO format
  medicalHistoryId?: number;
  medicines: CreateMedicineDto[]; // List of medicines associated with the prescription
}

export interface ViewPrescription {
  id: number;
  doctorId: number;
  patientId: number;
  prescriptionDate: string; // Date in ISO format
  medicalHistoryId?: number;
  medicines: CreateMedicineDto[]; // List of medicines associated with the prescription
}


export interface CreateMedicineDto {
    medicineName: string;
    instructions: string;
    dose: string;
    when: string;
    frequency: string;
    duration: string;
  }
  export interface ListPrescription {
    id: number;
    doctorId: number;
    patientId: number;
    prescriptionDate: string; // ISO string format
  }
  
  

  export type AddPrescription = Omit<Prescription, 'id'>;

  export type EditPrescription = Omit<Prescription, 'id'>;

  export type ListPrescriptionPage = Page<ListPrescription>;