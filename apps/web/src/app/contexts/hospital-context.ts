import { Hospital } from "@healthcare/data-transfer-types";
import React from "react";


export const HospitalContext=React.createContext<Hospital | null>(null);