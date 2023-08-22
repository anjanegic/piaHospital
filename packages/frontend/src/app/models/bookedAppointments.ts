import { User } from './user';
import { Appointment } from "./appointment";

export class BookedAppointment{
  appointment: Appointment;
  doctor: User;
  patient: User;
  date: Date;
}
