import { Gender } from "@prisma/client";


export interface Appointment {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber?: string;
    age: number;
    gender:Gender;
    date:Date;

}

export type AddAppointment = Omit<Appointment, 'id'>;


