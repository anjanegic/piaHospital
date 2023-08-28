import mongoose from 'mongoose'
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
    },
    bookedAppointment: {
        type: Object
    }
});

export default model('Reports', Report, 'reports');