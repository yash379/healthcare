import React, { createContext } from "react";
import { ViewDoctor } from "@healthcare/data-transfer-types";

export const DoctorContext = createContext<{doctor:ViewDoctor | null, setDoctor: React.Dispatch<React.SetStateAction<ViewDoctor | null>>} | null>(null);

export default DoctorContext;