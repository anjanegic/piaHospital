import express from 'express'
import Report from "../models/report"
import User from "../models/user"

export class ReportController {
    getUserReports = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        Report.find({'patient.username': username }, (err, reports) => {
            if (err) console.log(err);
            else {
                return res.json(reports);
            }
        })
    }
}