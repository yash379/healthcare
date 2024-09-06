import React, { createContext } from "react";
import { User, ViewDoctor, ViewUser } from "@healthcare/data-transfer-types";

export const DoctorContext = createContext<{doctor:ViewUser | null, setDoctor: React.Dispatch<React.SetStateAction<ViewUser | null>>} | null>(null);

export default DoctorContext;