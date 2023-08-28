import { BookedAppointment } from './bookedAppointments';
import { User } from './user';
export class Report {
  date: Date;
  reasonForVisit: string;
  diagnosis: string;
  recommendedTherapy: string;
  recommendedNextAppointment: Date;
  patient: User;
  doctor: User;
  bookedAppointment: BookedAppointment
}
