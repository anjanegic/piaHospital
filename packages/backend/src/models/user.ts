import mongoose, { model } from 'mongoose'

const Schema = mongoose.Schema;

enum UserType {
    Patient = 'patient',
    Doctor = 'doctor',
    Manager = 'manager'
  }

const User = new Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    password: {
        type: String
    },
    type: {
        type: String,
        enum: Object.values(UserType)
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    license: {
        type: Number
    },
    specialization: {
        type: String
    },
    branch: {
        type: String
    },
    approved: {
        type: Boolean
    },
    profile_picture: {
        type: String
    },
    appointments: {
        type: Array
    },
    bookedAppointments: {
        type: Array
    }
});

export default model('Users', User, 'users');
