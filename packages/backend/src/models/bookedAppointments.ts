import Appointment from "./appointment";
import mongoose, { model } from 'mongoose'

const Schema = mongoose.Schema;

const BookedAppointment = new Schema({
    appointment: {
        type: Appointment
    },
    doctor: {
        type: String
    },
    patient: {
        type: String
    },
    date:{
        type: String
    }

});

export default model('BookedAppointments', BookedAppointment, 'bookedAppointments');