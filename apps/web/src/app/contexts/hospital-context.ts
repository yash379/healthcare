import { Hospital } from "@healthcare/data-transfer-types";
import React, { createContext } from "react";


export const HospitalContext=createContext<{hospital:Hospital | null, setHospital: React.Dispatch<React.SetStateAction<Hospital | null>>} | null>(null);

export default HospitalContext;