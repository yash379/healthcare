import React, { createContext } from "react";
import { Doctor, User, ViewDoctor, ViewUser } from "@healthcare/data-transfer-types";

export const DoctorContext = createContext<{doctor:Doctor | null, setDoctor: React.Dispatch<React.SetStateAction<Doctor | null>>} | null>(null);

export default DoctorContext;