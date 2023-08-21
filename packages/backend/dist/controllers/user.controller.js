"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const jwt = require('jsonwebtoken');
class UserController {
    constructor() {
        this.login = (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            user_1.default.findOne({ 'username': username, 'password': password }, (err, user) => {
                if (err)
                    console.log(err);
                else {
                    //console.log(user._id);
                    // const jwtToken = generateJWT(user._id);
                    // console.log(jwtToken);
                    // const response = {
                    //     token: 123,
                    //     user: user // Dodajte ovde objekat sa informacijama o korisniku
                    // };
                    return res.json(user);
                }
            });
        };
        this.register = (req, res) => {
            let profile_picture = req.body.profile_picture;
            console.log(profile_picture);
            if (!profile_picture) {
                profile_picture = "../../assets/profile-icon-person-user-19.png";
            }
            console.log(profile_picture);
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
                profile_picture: profile_picture
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
        this.getAllDoctors = (req, res) => {
            user_1.default.find({ 'type': 'doctor' }, (err, user) => {
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
                            console.log(firstDate.getTime(), secondDate.getTime());
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
                let bookedAppointment = {
                    "doctor": doctor,
                    "patient": patient,
                    "date": date,
                    "appointment": appointmentFromUser
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
                            console.log(b.date);
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
    }
}
exports.UserController = UserController;
// function generateJWT(userId) {
//     const privateKey = 'YOUR_RSA_PRIVATE_KEY'; // Treba da postavite vaš privatni ključ ovde
//     const jwtToken = jwt.sign({}, privateKey, {
//         algorithm: 'RS256',
//         expiresIn: '1h', 
//         subject: userId,
//     });
//     return jwtToken;
// }
//# sourceMappingURL=user.controller.js.map