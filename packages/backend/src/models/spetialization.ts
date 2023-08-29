import mongoose, { model } from 'mongoose'

const Schema = mongoose.Schema;

const Specialization = new Schema({ 
    name: {
        type: String
    },
    appointments: {
        type: Array
    },
    branch: {
        type: String
    }
});

export default model('Specializations', Specialization, 'specializations');
