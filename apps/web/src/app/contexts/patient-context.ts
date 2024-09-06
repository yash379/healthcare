import { ListPatient, Patient, ViewPatient } from "@healthcare/data-transfer-types";
import {createContext} from "react";

export interface PatientContextType {
    // patient: number | undefined;
    // patientName: string;
    patientDetails : ViewPatient
}

// export const PatientContext = createContext<PatientContextType>({
//     // patient: undefined,
//     // patientName: '',
//     patientDetails : {} as ViewPatient
// })

export const PatientContext = createContext<{patient:Patient | null, setPatient: React.Dispatch<React.SetStateAction<Patient | null>>} | null>(null);

export default PatientContext;