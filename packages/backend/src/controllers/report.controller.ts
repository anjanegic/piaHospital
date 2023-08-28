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

    addReport = (req: express.Request, res: express.Response) => {
        let reportUser = req.body.report;        
        let rep = new Report(reportUser);
        
        rep.save((err, resp) => {
            if (err) {
                console.log(err);
                res.status(400).json({ "message": "error" })
            }
    
            User.findOne({ username: reportUser.patient.username  }, (err, user) => {
                if (err) {
                    return res.json({ message: 'error' });
                } else{
                    for (let b of user.bookedAppointments){
                        //console.log("PRE: ", user.bookedAppointments)
                        if (b.date === rep.bookedAppointment.date){
                            b.report = true;
                            break;
                        }
                        //console.log("POSLE: ",  user.bookedAppointments)
                    }
                }
                User.findOneAndUpdate({ username: reportUser.patient.username }, { $set: { bookedAppointments: user.bookedAppointments } }, (err, success) => {
                    if (err) {
                        return res.json({ message: 'error' });
                    }
                });
            });
            return res.json({'message': 'success'});
        });
    }

}