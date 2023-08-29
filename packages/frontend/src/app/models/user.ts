import { BookedAppointment } from './bookedAppointments';
import { Appointment } from "./appointment";

export class User{
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    type: string;
    email: string;
    address: string;
    phone: string;
    license: number;
    specialization: string;
    branch: string;
    approved: boolean;
    deleted: boolean;
    profile_picture: string;
    appointments: Array<Appointment>
    bookedAppointments: Array<BookedAppointment>
}
