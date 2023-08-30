import express from 'express'
import { UserController } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.route('/login').post(
    (req, res)=>new UserController().login(req, res)
)

userRouter.route('/register').post(
    (req, res)=>new UserController().register(req, res)
)

userRouter.route('/registerDoctor').post(
    (req, res)=>new UserController().registerDoctor(req, res)
)

userRouter.route('/checkExistingUser').post(
    (req, res)=>new UserController().checkExistingUser(req, res)
)

userRouter.route('/getAllDoctors').get(
    (req, res)=> new UserController().getAllDoctors(req, res)
)

userRouter.route('/changePassword').post(
    (req, res)=>new UserController().changePassword(req, res)
)

userRouter.route('/getLoggedInUser').post(
    (req, res)=>new UserController().getLoggedInUser(req, res)
)

userRouter.route('/updateUserProfile').post(
    (req, res)=>new UserController().updateUserProfile(req, res)
)

userRouter.route('/findAppointment').post(
    (req, res)=>new UserController().findAppointment(req, res)
)

userRouter.route('/bookAppointment').post(
    (req, res)=>new UserController().bookAppointment(req, res)
)

userRouter.route('/getBookedAppointments').post(
    (req, res)=>new UserController().getBookedAppointments(req, res)
)

userRouter.route('/deleteAppointment').post(
    (req, res)=>new UserController().deleteAppointment(req, res)
)

userRouter.route('/getChosenAppointments').post(
    (req, res)=>new UserController().getChosenAppointments(req, res)
)

userRouter.route('/saveCheckedAppointments').post(
    (req, res)=>new UserController().saveCheckedAppointments(req, res)
)

userRouter.route('/createAppointment').post(
    (req, res)=>new UserController().createAppointment(req, res)
)

userRouter.route('/getPastBookedAppointments').post(
    (req, res)=>new UserController().getPastBookedAppointments(req, res)
)

userRouter.route('/getAllPatients').get(
    (req, res)=> new UserController().getAllPatients(req, res)
)

userRouter.route('/getAllPatientsWaiting').get(
    (req, res)=> new UserController().getAllPatientsWaiting(req, res)
)

userRouter.route('/deleteUser').post(
    (req, res)=> new UserController().deleteUser(req, res)
)

userRouter.route('/approveUser').post(
    (req, res)=> new UserController().approveUser(req, res)
)

userRouter.route('/approveAppointment').post(
    (req, res)=> new UserController().approveAppointment(req, res)
)

userRouter.route('/changeAppointment').post(
    (req, res)=> new UserController().changeAppointment(req, res)
)

userRouter.route('/disableAppointment').post(
    (req, res)=> new UserController().disableAppointment(req, res)
)

userRouter.route('/createAppointmentManager').post(
    (req, res)=> new UserController().createAppointmentManager(req, res)
)

export default userRouter;