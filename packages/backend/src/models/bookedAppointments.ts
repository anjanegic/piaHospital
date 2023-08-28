import Appointment from "./appointment";
import User from "./user";
import mongoose, { model } from 'mongoose'

const Schema = mongoose.Schema;

const BookedAppointment = new Schema({
    appointment: {
        type: Appointment
    },
    doctor: {
        type: User
    },
    patient: {
        type: User
    },
    date:{
        type: String
    },
    report:{
        type: Boolean
    }

});

export default model('BookedAppointments', BookedAppointment, 'bookedAppointments');