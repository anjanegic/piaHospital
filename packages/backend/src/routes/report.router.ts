import express from "express";
import { ReportController } from '../controllers/report.controller';

const reportRouter = express.Router();

reportRouter.route('/getUserReports').post(
    (req, res)=>new ReportController().getUserReports(req, res)
)

reportRouter.route('/addReport').post(
    (req, res)=>new ReportController().addReport(req, res)
)

export default reportRouter;;