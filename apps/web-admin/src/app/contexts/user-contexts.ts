import React from "react";
import { Hospital, User, ViewUser } from "@healthcare/data-transfer-types";

export const UserContext = React.createContext<User | null>(null);
export const HospitalContext=React.createContext<Hospital | null>(null);