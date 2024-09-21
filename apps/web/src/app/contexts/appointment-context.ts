import React, { createContext } from "react";
import { Doctor, User, ViewDoctor, ViewUser } from "@healthcare/data-transfer-types";
import { ViewAppointment } from "../pages/list-appoinment-new/list-appointments/list-appointments";



export const AppointmentContext = createContext<{appointment:ViewAppointment| null, setAppointment: React.Dispatch<React.SetStateAction<ViewAppointment | null>>} | null>(null);

export default AppointmentContext;