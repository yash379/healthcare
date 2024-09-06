import { Hospital, ViewUser } from "@healthcare/data-transfer-types";
import {  HospitalRoleName, SuperRoleName } from "@prisma/client";
import React from "react";
// import {  User  } from "@healthcare/data-transfer-types";



// interface User {
//     id: number;
//     firstName: string;
//     lastName: string;
//     email: string;
//     phoneNumber: string;
//     hospitalRoles: {
//         hospitalId: number;
//         hospitalName: string;
//         hospitalRole: string;
//     }[],
//     organizationRoles?: OrganizationRoleDto[];
//     superRole?: SuperRoleName;
//     doctorId?:number;
//     patientId?:number;
// }



// export interface OrganizationRoleDto {
//     organizationId: number;
//     organizationRole: HospitalRoleName;
// }


export const UserContext = React.createContext<ViewUser | null>(null);
export const HospitalContext=React.createContext<Hospital | null>(null);

export default UserContext;
