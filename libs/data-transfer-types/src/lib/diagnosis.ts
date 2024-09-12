import { ListDoctor } from "./doctor";
import { Page } from "./page";

export interface Diagnosis {
    id: number; // To handle both cases where it's present or not (for AddDiagnosis).
    details: string;
    doctorId: number;
    patientId: number;
    height?: number;
    weight?: number;
    pulse?: number;
    spo2?: number;
    bmi?: number;
    temperature?: number;
    chiefComplaints: string[];
    diagnosisDate?: string;  // Include the diagnosis date from the model

}

export interface ViewDiagnosis {
    id: number;
    doctorId: number;
    patientId: number;
    details: string;
    height?: number;
    weight?: number;
    pulse?: number;
    spo2?: number;
    bmi?: number;
    temperature?: number;
    chiefComplaints: string[];
    diagnosisDate: string;    // Read-only, present in the view
      // Optional as it's updated automatically
}

export type ListDiagnosis = Pick<Diagnosis, 'chiefComplaints' | 'doctorId' | 'patientId'>;

export type AddDiagnosis = Omit<Diagnosis, 'id'>;

// export type EditDiagnosis = Omit<Diagnosis, 'createdAt' | 'updatedAt' | 'diagnosisDate'>;
export type ListDiagnosisPage = Page<ListDiagnosis>;