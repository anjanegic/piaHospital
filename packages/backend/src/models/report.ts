import mongoose from 'mongoose'
import User from './user';
const { model } = mongoose;

const Schema = mongoose.Schema;

const Report = new Schema({
    patient: {
        type: Object
    },
    doctor: {
        type: Object
    },
    date: {
        type: String
    },
    recommendedNextAppointment: {
        type: String
    },
    recommendedTherapy: {
        type: String
    },
    diagnosis: {
        type: String
    },
    reasonForVisit: {
        type: String
    }

});

export default model('Reports', Report, 'reports');