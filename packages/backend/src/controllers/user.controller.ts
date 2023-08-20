
import express from 'express'
import User from '../models/user'
import * as jwt from 'jsonwebtoken';
const jwt = require('jsonwebtoken');

export class UserController{

    

    login = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;

        User.findOne({ 'username': username, 'password': password }, (err, user) => {
            if (err) console.log(err);
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
        })
    }

    register = (req: express.Request, res: express.Response)=>{
        let profile_picture = req.body.profile_picture;
        console.log(profile_picture)
        if (!profile_picture){
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
            profile_picture: profile_picture
        })

        //let user = new UserModel(req.body)

        user.save((err, resp)=>{
            if(err) {
                console.log(err);
                res.status(400).json({"message": "error"})
            }
            else res.json({"message": "ok"})
        })

        
    }

    getAllDoctors = (req: express.Request, res: express.Response)=>{
        User.find({ 'type': 'doctor' }, (err, user)=>{
            if(err) console.log(err)
            else res.json(user)
        })

    }

    changePassword = (req: express.Request, res: express.Response)=>{
       
        let username = req.body.username;
        let password = req.body.password;
        let newPassword = req.body.newPassword;
        
        User.findOne({ 'username': username, 'password': password }, (err, user) => {
            if (err) console.log(err);
            if (!user) {
                return res.json({ 'message': 'error' });
            }
            else {          
                User.updateOne({'username': username}, {$set: {'password': newPassword}}, (err, resp)=>{
                    if(err) console.log(err)
                    else res.json({'message': 'ok'})
                })
            }
        })
    }

    getLoggedInUser = (req: express.Request, res: express.Response) => {
        let username = req.body.username;

        User.findOne({ 'username': username}, (err, user) => {
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
       
        User.findOne({ 'username': username}, (err, user) => {
            if (err) console.log(err);
            else {          
                for (const [key, value] of Object.entries(fields)) {
                    const f = {}
                    f[key]= value;
                    User.updateOne({'username': username}, {$set: f}, (err, resp)=>{
                        if(err){
                            console.log(err)
                        }
                        else {
                            
                            console.log("passed");
                            passed = 1;
                        }
                    })
                }
                res.json({'message': 'ok'})
            }
        })
    }

    findAppointment = (req:  express.Request, res: express.Response) => {
        let u = req.body.doctor;
        let date = req.body.date;
        
        User.findOne({'username': u}, (err, user) => {
            if (err) 
                console.log(err);
            else if (!user) {
                return res.json({'message': 'error' });
            }
            else { 
                if (user.bookedAppointments.length>0){
                    for (let b of user.bookedAppointments){
                        console.log(b.date)
                        const firstDate = new Date(b.date);
                        const secondDate = new Date(date);
                        console.log(firstDate.getTime(), secondDate.getTime());
                        if (firstDate.getTime() == secondDate.getTime())
                            res.json({'message': 'error'})
                    }
                }     
            } 
        })
    }

    bookAppointment = (req:  express.Request, res: express.Response) => {
        let doctor = req.body.doctor;
        let patient = req.body.patient;
        let date = req.body.date;
        let appointment = req.body.appointment;

        let bookedAppointment = {
            "doctor": doctor,
            "patient": patient,
            "date": date,
            "appointment": appointment
        }
        console.log(bookedAppointment)
        User.findOneAndUpdate({ username: doctor }, { $push: { bookedAppointments: bookedAppointment } }, (err, success) => {
            console.log(doctor);
            if (err) console.log(err);
            else res.json({ msg: "Success" });
        });
          

        User.findOneAndUpdate({ username: patient }, { $push: { bookedAppointments: bookedAppointment} }, (err, success) => {
            if (err) console.log(err);
            else res.json({ msg: "Success" })
        })
    }
}

// function generateJWT(userId) {
//     const privateKey = 'YOUR_RSA_PRIVATE_KEY'; // Treba da postavite vaš privatni ključ ovde

//     const jwtToken = jwt.sign({}, privateKey, {
//         algorithm: 'RS256',
//         expiresIn: '1h', 
//         subject: userId,
//     });

//     return jwtToken;
// }