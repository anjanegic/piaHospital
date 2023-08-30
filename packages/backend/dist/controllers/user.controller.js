"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
class UserController {
    constructor() {
        this.login = (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            user_1.default.findOne({ 'username': username, 'password': password }, (err, user) => {
                if (err)
                    console.log(err);
                else {
                    return res.json(user);
                }
            });
        };
        this.register = (req, res) => {
            let user = new user_1.default({
                first_name: req.body.firstname,
                last_name: req.body.lastname,
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                address: req.body.address,
                phone: req.body.phone,
                type: "patient",
                approved: false,
                deleted: false,
                profile_picture: req.body.profile_picture,
                appointments: [],
                bookedAppointments: []
            });
            user.save((err, resp) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({ "message": "error" });
                }
                else
                    res.json({ "message": "ok" });
            });
        };
        this.registerDoctor = (req, res) => {
            let user = new user_1.default({
                first_name: req.body.firstname,
                last_name: req.body.lastname,
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                address: req.body.address,
                phone: req.body.phone,
                type: "doctor",
                approved: true,
                deleted: false,
                profile_picture: req.body.profile_picture,
                appointments: req.body.appointments,
                specialization: req.body.specialization,
                branch: req.body.branch,
                license: req.body.license,
                bookedAppointments: []
            });
            user.save((err, resp) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({ "message": "error" });
                }
                else
                    res.json({ "message": "ok" });
            });
        };
        this.checkExistingUser = (req, res) => {
            const username = req.body.username;
            const email = req.body.email;
            user_1.default.findOne({ $or: [{ 'username': username }, { 'email': email }] }, (err, user) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ "message": "error" });
                }
                else if (user) {
                    res.json({ "message": "exists" });
                }
                else {
                    res.json({ "message": "ok" });
                }
            });
        };
        this.saveCheckedAppointments = (req, res) => {
            let savedApp = req.body.appointments;
            let username = req.body.user;
            user_1.default.updateOne({ 'username': username }, { $set: { 'appointments': savedApp } }, (err, resp) => {
                if (err)
                    console.log(err);
                else
                    res.json({ 'message': 'ok' });
            });
        };
        this.getAllDoctors = (req, res) => {
            user_1.default.find({ 'type': 'doctor', 'deleted': false }, (err, user) => {
                if (err)
                    console.log(err);
                else
                    res.json(user);
            });
        };
        this.changePassword = (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            let newPassword = req.body.newPassword;
            user_1.default.findOne({ 'username': username, 'password': password }, (err, user) => {
                if (err)
                    console.log(err);
                if (!user) {
                    return res.json({ 'message': 'error' });
                }
                else {
                    user_1.default.updateOne({ 'username': username }, { $set: { 'password': newPassword } }, (err, resp) => {
                        if (err)
                            console.log(err);
                        else
                            res.json({ 'message': 'ok' });
                    });
                }
            });
        };
        this.getLoggedInUser = (req, res) => {
            let username = req.body.username;
            user_1.default.findOne({ 'username': username }, (err, user) => {
                if (err)
                    console.log(err);
                else {
                    return res.json(user);
                }
            });
        };
        this.updateUserProfile = (req, res) => {
            let username = req.body.username;
            let fields = req.body.updatedProfile;
            let passed = 0;
            user_1.default.findOne({ 'username': username }, (err, user) => {
                if (err)
                    console.log(err);
                else {
                    for (const [key, value] of Object.entries(fields)) {
                        const f = {};
                        f[key] = value;
                        user_1.default.updateOne({ 'username': username }, { $set: f }, (err, resp) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                passed = 1;
                            }
                        });
                    }
                    res.json({ 'message': 'ok' });
                }
            });
        };
        this.findAppointment = (req, res) => {
            let u = req.body.doctor;
            let date = req.body.date;
            user_1.default.findOne({ 'username': u }, (err, user) => {
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
                                return res.json({ 'message': 'error' });
                        }
                    }
                    return res.json({ 'message': 'free' });
                }
            });
        };
        this.bookAppointment = (req, res) => {
            const { doctor, patient, date, appointment } = req.body;
            let message = 'Success';
            user_1.default.findOne({ 'username': doctor }, (err, user) => {
                let appointmentFromUser = {};
                if (err) {
                    return res.json({ message: 'error' });
                }
                else {
                    for (const a of user.appointments) {
                        if (a.name === appointment) {
                            appointmentFromUser = a;
                            break;
                        }
                    }
                }
                user_1.default.findOne({ 'username': patient }, (err, user2) => {
                    let bookedAppointment = {
                        "doctor": user,
                        "patient": user2,
                        "date": date,
                        "appointment": appointmentFromUser,
                        "report": false
                    };
                    user_1.default.findOneAndUpdate({ username: doctor }, { $push: { bookedAppointments: bookedAppointment } }, (err, success) => {
                        if (err) {
                            return res.json({ message: 'error' });
                        }
                    });
                    user_1.default.findOneAndUpdate({ username: patient }, { $push: { bookedAppointments: bookedAppointment } }, (err, success) => {
                        if (err) {
                            console.log(err);
                            return res.json({ message: 'error' });
                        }
                    });
                });
            });
            return res.json({ message });
        };
        this.getBookedAppointments = (req, res) => {
            let user = req.body.user;
            user_1.default.findOne({ 'username': user }, (err, u) => {
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
                                bookedAppointments.push(b);
                        }
                        return res.json({ 'message': bookedAppointments });
                    }
                }
            });
        };
        this.getChosenAppointments = (req, res) => {
            let user = req.body.user;
            console.log(user);
            user_1.default.findOne({ 'username': user }, (err, userD) => {
                if (err)
                    console.log(err);
                else {
                    let chosenApp = [];
                    for (let i of userD.appointments) {
                        if (i.chosen) {
                            chosenApp.push(i);
                        }
                    }
                    res.json(chosenApp);
                }
            });
        };
        this.deleteAppointment = (req, res) => {
            let app = req.body.app;
            let username = req.body.username;
            user_1.default.findOne({ 'username': username }, function (err, user) {
                if (err) {
                    console.log(err);
                }
                else {
                    for (let b of user.bookedAppointments) {
                        const first = new Date(app.date);
                        const sec = new Date(b.date);
                        console.log("PRVI " + first.getTime() + ", DRUGI: " + sec.getTime());
                        if (first.getTime() === sec.getTime()) {
                            const indexToRemove = user.bookedAppointments.findIndex(appointment => first.getTime() === sec.getTime());
                            if (indexToRemove !== -1) {
                                user.bookedAppointments.splice(indexToRemove, 1);
                                console.log('Element je uspešno uklonjen.');
                                break;
                            }
                            else {
                                console.log('Element nije pronađen u nizu.');
                            }
                        }
                    }
                    user_1.default.updateOne({ 'username': username }, { $set: { "bookedAppointments": user.bookedAppointments } }, (err, resp) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            return res.json({ message: user.bookedAppointments });
                        }
                    });
                }
            });
        };
        this.createAppointment = (req, res) => {
            let user = req.body.user;
            let appointment = req.body.appointment;
            user_1.default.findOneAndUpdate({ username: user.username }, { $push: { appointments: appointment } }, (err, success) => {
                if (err) {
                    return res.json({ message: 'error' });
                }
                else {
                    return res.json({ message: 'success' });
                }
            });
        };
        this.createAppointmentManager = (req, res) => {
            let specialization = req.body.specialization;
            let appointment = req.body.appointment;
            console.log(specialization, appointment);
            user_1.default.find({ 'specialization': specialization }, (err, users) => {
                if (err)
                    console.log(err);
                else {
                    for (let user of users) {
                        console.log(user);
                        user_1.default.updateOne({ 'username': user.username }, { $push: { 'appointments': appointment } }, (err, success) => {
                            if (err) {
                                return res.json({ message: 'error' });
                            }
                            else {
                                return res.json({ message: 'success' });
                            }
                        });
                    }
                }
            });
        };
        this.getPastBookedAppointments = (req, res) => {
            let patient = req.body.patient;
            let doctor = req.body.doctor;
            user_1.default.findOne({ 'username': patient }, (err, u) => {
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
                                bookedAppointments.push(b);
                        }
                        return res.json(bookedAppointments);
                    }
                }
            });
        };
        this.getAllPatients = (req, res) => {
            user_1.default.find({ 'type': 'patient', 'approved': true, 'deleted': false }, (err, user) => {
                if (err)
                    console.log(err);
                else
                    res.json(user);
            });
        };
        this.getAllPatientsWaiting = (req, res) => {
            user_1.default.find({ 'type': 'patient', 'approved': false, 'deleted': false }, (err, user) => {
                if (err)
                    console.log(err);
                else
                    res.json(user);
            });
        };
        this.deleteUser = (req, res) => {
            let username = req.body.username;
            user_1.default.updateOne({ 'username': username }, { $set: { 'approved': false, 'deleted': true } }, (err, resp) => {
                if (err)
                    console.log(err);
                else
                    res.json({ 'message': 'ok' });
            });
        };
        this.approveUser = (req, res) => {
            let username = req.body.username;
            user_1.default.updateOne({ 'username': username }, { $set: { 'approved': true } }, (err, resp) => {
                if (err)
                    console.log(err);
                else
                    res.json({ 'message': 'ok' });
            });
        };
        this.approveAppointment = (req, res) => {
            let name = req.body.name;
            let username = req.body.username;
            let appointments = [];
            user_1.default.findOne({ 'username': username }, (err, user) => {
                if (err)
                    console.log(err);
                else {
                    for (let a of user.appointments) {
                        if (a.name === name) {
                            a.approved = true;
                        }
                    }
                    appointments = user.appointments;
                    user_1.default.updateOne({ 'username': username }, { $set: { 'appointments': appointments } }, (err, userApp) => {
                        if (err)
                            console.log(err);
                        else {
                            user_1.default.findOne({ 'username': username }, (err, userUp) => {
                                if (err)
                                    console.log(err);
                                else {
                                    return res.json(userUp);
                                }
                            });
                        }
                    });
                }
            });
        };
        this.changeAppointment = (req, res) => {
            let appointments = [];
            let newappointment = req.body.appointment;
            let specialization = req.body.specialization;
            let oldAppointment = req.body.oldAppointment;
            user_1.default.find({ 'specialization': specialization }, (err, users) => {
                if (err)
                    console.log(err);
                else {
                    for (let user of users) {
                        for (let i = 0; i < user.appointments.length; i++) {
                            if (user.appointments[i].name === oldAppointment.name) {
                                newappointment.chosen = user.appointments[i].chosen;
                                break;
                            }
                        }
                        user.appointments = user.appointments.filter(a => a.name !== oldAppointment.name);
                        newappointment.approved = true;
                        user.appointments.push(newappointment);
                        user_1.default.updateOne({ 'username': user.username }, { $set: { "appointments": user.appointments } }, (err, resp) => {
                            if (err)
                                console.log(err);
                            else
                                console.log(resp);
                        });
                    }
                    return res.json({ 'message': 'ok' });
                }
            });
        };
        this.disableAppointment = (req, res) => {
            let appointments = [];
            let appointment = req.body.appointment;
            let specialization = req.body.specialization;
            console.log(appointment);
            console.log(specialization);
            user_1.default.find({ 'specialization': specialization }, (err, users) => {
                if (err)
                    console.log(err);
                else {
                    for (let user of users) {
                        console.log("user");
                        console.log("pre ", user.appointments);
                        for (let i = 0; i < user.appointments.length; i++) {
                            if (user.appointments[i].name === appointment) {
                                user.appointments[i].chosen = false;
                                user.appointments[i].approved = false;
                                break;
                            }
                        }
                        console.log("Posle ", user.appointments);
                        user_1.default.updateOne({ 'username': user.username }, { $set: { "appointments": user.appointments } }, (err, resp) => {
                            if (err)
                                console.log(err);
                            else
                                console.log(resp);
                        });
                    }
                    return res.json({ 'message': 'ok' });
                }
            });
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map