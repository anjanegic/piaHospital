import express from 'express'
import Specialization from '../models/spetialization'

export class SpecializationController {

    getAllSpecializations = (req: express.Request, res: express.Response) => {
        Specialization.find( (err, spec) => {
            if (err) console.log(err)
            else res.json(spec)
        })
    }

    addSpecialization = (req: express.Request, res: express.Response) => {
       
        let spec = new Specialization({
            name: req.body.name,
            branch: req.body.branch,
        })

        spec.save((err, resp) => {
            if (err) {
                console.log(err);
                res.status(400).json({ "message": "error" })
            }
            else res.json({ "message": "ok" })
        })
    }

    deleteAppointment = (req: express.Request, res: express.Response) => {
      
        let appointments=[];
        let appointment = req.body.appointment;
        let specialization = req.body.specialization;
        console.log(appointment);
        console.log(specialization);

        Specialization.findOne({'name': specialization}, (err, spec)=>{
            if(err) console.log(err);
            else {
                console.log(spec.appointments);
                
                for (let i = 0; i < spec.appointments.length; i++) {
                    if (spec.appointments[i].name === appointment) {
                      spec.appointments.splice(i, 1);
                      break; 
                    }
                }
                appointments = spec.appointments;
                console.log(spec.appointments);
                Specialization.updateOne({'name': specialization},{ $set: {"appointments": spec.appointments}}, (err, resp)=>{
                    if(err) console.log(err);
                    else {
                        Specialization.findOne({ 'name': specialization}, (err, special) => {
                            if (err) console.log(err);
                            else {
                                res.json(special)
                            }
                        })
                    }
                })
            }
        })
    }


    changeAppointment = (req: express.Request, res: express.Response) => {
      
        let appointments=[];
        let newappointment = req.body.appointment;
        let specialization = req.body.specialization;
        let oldAppointment = req.body.oldAppointment;
        console.log(newappointment);
        console.log(specialization);

        Specialization.findOne({'name': specialization}, (err, spec)=>{
            if(err) console.log(err);
            else {
                spec.appointments = spec.appointments.filter(a => a.name !== oldAppointment.name);
                newappointment.approved = true;
                newappointment.approved = false;
                spec.appointments.push(newappointment);
                Specialization.updateOne({'name': specialization},{ $set: {"appointments": spec.appointments}}, (err, resp)=>{
                    if(err) console.log(err);
                    else {
                        Specialization.findOne({ 'name': specialization}, (err, special) => {
                            if (err) console.log(err);
                            else {
                                res.json(special)
                            }
                        })
                    }
                })
            }
        })
    }

    createAppointment = (req: express.Request, res: express.Response) => {
      let specialization = req.body.specialization;
      let appointment = req.body.appointment;

      Specialization.findOneAndUpdate({ name: specialization }, { $push: { appointments: appointment } }, (err, success) => {
          if (err) {
              return res.json({ message: 'error' });
          } else {
              return res.json({ message: 'success' });
          }
      });
  }

}