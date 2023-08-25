import mongoose, { model } from 'mongoose'

const Schema = mongoose.Schema;

const Appointment = new Schema({
    name: {
        type: String
    },
    duration: {
        type: Number
    },
    price: {
        type: Number
    },
    chose: {
        type: Boolean
    }

});

export default model('Appointments', Appointment, 'appointments');