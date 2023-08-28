import express from 'express'
import { json } from 'stream/consumers';
import User from '../models/user'
const jwt = require('jsonwebtoken');

export class UserController {
    login = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;

        User.findOne({ 'username': username, 'password': password }, (err, user) => {
            if (err) console.log(err);
            else {
                return res.json(user);
            }
        })
    }

    register = (req: express.Request, res: express.Response) => {
        let profile_picture = req.body.profile_picture;
        console.log(profile_picture)
        if (!profile_picture) {
            profile_picture = "../../assets/profile-icon-person-user-19.png"
        }
        console.log(profile_picture)
        let user = new User({
            first_name: req.body.firstname,
            last_name: req.body.lastname,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            address: req.body.address,
            phone: req.body.phone,
            type: "patient",
            approved: false,
            profile_picture: profile_picture,
            appointments: [],
            bookedAppointments:[]
        })

        user.save((err, resp) => {
            if (err) {
                console.log(err);
                res.status(400).json({ "message": "error" })
            }
            else res.json({ "message": "ok" })
        })
    }

    saveCheckedAppointments = (req: express.Request, res: express.Response) => {
        let savedApp = req.body.appointments;
        let username = req.body.user;
        User.updateOne({ 'username': username }, { $set: { 'appointments': savedApp } }, (err, resp) => {
            if (err) console.log(err)
            else res.json({ 'message': 'ok' })
        })
    }

    getAllDoctors = (req: express.Request, res: express.Response) => {
        User.find({ 'type': 'doctor' }, (err, user) => {
            if (err) console.log(err)
            else res.json(user)
        })
    }

    changePassword = (req: express.Request, res: express.Response) => {

        let username = req.body.username;
        let password = req.body.password;
        let newPassword = req.body.newPassword;

        User.findOne({ 'username': username, 'password': password }, (err, user) => {
            if (err) console.log(err);
            if (!user) {
                return res.json({ 'message': 'error' });
            }
            else {
                User.updateOne({ 'username': username }, { $set: { 'password': newPassword } }, (err, resp) => {
                    if (err) console.log(err)
                    else res.json({ 'message': 'ok' })
                })
            }
        })
    }

    getLoggedInUser = (req: express.Request, res: express.Response) => {
        let username = req.body.username;

        User.findOne({ 'username': username }, (err, user) => {
            if (err) console.log(err);
            else {
                return res.json(user);
            }
        })
    }

    updateUserProfile = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let fields = req.body.updatedProfile;
        let passed = 0;

        User.findOne({ 'username': username }, (err, user) => {
            if (err) console.log(err);
            else {
                for (const [key, value] of Object.entries(fields)) {
                    const f = {}
                    f[key] = value;
                    User.updateOne({ 'username': username }, { $set: f }, (err, resp) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            passed = 1;
                        }
                    })
                }
                res.json({ 'message': 'ok' })
            }
        })
    }

    findAppointment = (req: express.Request, res: express.Response) => {
        let u = req.body.doctor;
        let date = req.body.date;

        User.findOne({ 'username': u }, (err, user) => {
            if (err)
                console.log(err);
            else if (!user) {
                return res.json({ 'message': 'error' });
            }
            else {
                if (user.bookedAppointments.length > 0) {
                    for (let b of user.bookedAppointments) {
                        const firstDate = new Date(b.date);
                        const secondDate = new Date(date);
                        //console.log(firstDate.getTime(), secondDate.getTime());
                        if (firstDate.getTime() == secondDate.getTime())
                            return res.json({ 'message': 'error' })
                    }
                }
                return res.json({ 'message': 'free' })
            }
        })
    }

    bookAppointment = (req: express.Request, res: express.Response) => {
        const { doctor, patient, date, appointment } = req.body
        let message = 'Success';
        User.findOne({ 'username': doctor }, (err, user) => {
            let appointmentFromUser = {}
            if (err) {
                return res.json({ message: 'error' });
            } else {
                for (const a of user.appointments) {
                    if (a.name === appointment) {
                        appointmentFromUser = a;
                        break;
                    }
                }
            }
            User.findOne({ 'username': patient }, (err, user2) => {
                let bookedAppointment = {
                    "doctor": user,
                    "patient": user2,
                    "date": date,
                    "appointment": appointmentFromUser,
                    "report": false
                }
                User.findOneAndUpdate({ username: doctor }, { $push: { bookedAppointments: bookedAppointment } }, (err, success) => {
                    if (err) {
                        return res.json({ message: 'error' });
                    }
                });
                User.findOneAndUpdate({ username: patient }, { $push: { bookedAppointments: bookedAppointment } }, (err, success) => {
                    if (err) {
                        console.log(err);
                        return res.json({ message: 'error' });
                    }
                });
            
            })
           
        })
        return res.json({ message });
    }

    getBookedAppointments = (req: express.Request, res: express.Response) => {
        let user = req.body.user;
        User.findOne({ 'username': user }, (err, u) => {
            let bookedAppointments = [];
            if (err)
                console.log(err);
            else if (!u) {
                return res.json({ 'message': 'error' });
            }
            else {
                if (u.bookedAppointments.length > 0) {
                    for (let b of u.bookedAppointments) {
                        const firstDate = new Date(b.date);
                        const secondDate = new Date();
                        console.log(firstDate.getTime(), secondDate.getTime());
                        if (firstDate.getTime() > secondDate.getTime())
                            bookedAppointments.push(b)
                    }
                    return res.json({ 'message': bookedAppointments })
                }
            }
        })
    }

    getChosenAppointments = (req: express.Request, res: express.Response) => {
        let user = req.body.user;
        console.log(user);
        
        User.findOne({'username': user },(err, userD)=>{
            if (err) console.log(err)
            else {
                let chosenApp = [];
                for(let i of userD.appointments){
                    if (i.chosen){
                        chosenApp.push(i)
                    }
                }
                res.json(chosenApp);
            }
        })
        
    }

    deleteAppointment = (req: express.Request, res: express.Response) => {
        let app = req.body.app;
        let username = req.body.username;
        User.findOne({'username': username }, function (err, user) {
            if (err){
                console.log(err)
            }
            else{
                for (let b of user.bookedAppointments) {
                    const first = new Date(app.date);
                    const sec = new Date(b.date);
                    console.log("PRVI "+ first.getTime() + ", DRUGI: "+sec.getTime());
                    
                    if (first.getTime() === sec.getTime()) {
                        const indexToRemove = user.bookedAppointments.findIndex(appointment => first.getTime() === sec.getTime());
                      
                        if (indexToRemove !== -1) {
                          user.bookedAppointments.splice(indexToRemove, 1);
                          console.log('Element je uspešno uklonjen.');
                          break;
                        } else {
                          console.log('Element nije pronađen u nizu.');
                        }
                    }


                }
                User.updateOne({ 'username': username }, { $set:  {"bookedAppointments": user.bookedAppointments}}, (err, resp) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("USPEJHHHHH")
                        return res.json({ message: user.bookedAppointments})
                    }
                })
                
            }
        });
    }

    createAppointment= (req: express.Request, res: express.Response) => {
        let user = req.body.user;
        let appointment = req.body.appointment;

        User.findOneAndUpdate({ username: user.username }, { $push: { appointments: appointment } }, (err, success) => {
            if (err) {
                return res.json({ message: 'error' });
            } else{
                return res.json({ message: 'success' });
            }
        });
    }

    getPastBookedAppointments = (req: express.Request, res: express.Response) =>{
        let patient = req.body.patient;
        let doctor = req.body.doctor;
        User.findOne({ 'username': patient }, (err, u) => {
            let bookedAppointments = [];
            if (err)
                console.log(err);
            else if (!u) {
                return res.json({ 'message': 'error' });
            }
            else {
                if (u.bookedAppointments.length > 0) {
                    for (let b of u.bookedAppointments) {
                        const firstDate = new Date(b.date);
                        const secondDate = new Date();
                        if (firstDate.getTime() <= secondDate.getTime() && b.doctor.username === doctor && b.report === false)
                            bookedAppointments.push(b)
                    }
                    return res.json(bookedAppointments)
                }
            }
        })
    }

    getAllPatients = (req: express.Request, res: express.Response) => {
        User.find({ 'type': 'patient' }, (err, user) => {
            if (err) console.log(err)
            else res.json(user)
        })
    }
}