import { SpecializationController } from './../controllers/specialization.controller';
import express from "express";

const specializationRouter = express.Router();

specializationRouter.route('/getAllSpecializations').get(
    (req, res)=>new SpecializationController().getAllSpecializations(req, res)
)

specializationRouter.route('/addSpecialization').post(
    (req, res)=>new SpecializationController().addSpecialization(req, res)
)

specializationRouter.route('/deleteAppointment').post(
    (req, res)=>new SpecializationController().deleteAppointment(req, res)
)

specializationRouter.route('/changeAppointment').post(
    (req, res)=>new SpecializationController().changeAppointment(req, res)
)

specializationRouter.route('/createAppointment').post(
    (req, res)=>new SpecializationController().createAppointment(req, res)
)



export default specializationRouter;;