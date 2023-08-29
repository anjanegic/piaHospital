import { SpecializationController } from './../controllers/specialization.controller';
import express from "express";

const specializationRouter = express.Router();

specializationRouter.route('/getAllSpecializations').get(
    (req, res)=>new SpecializationController().getAllSpecializations(req, res)
)

export default specializationRouter;;