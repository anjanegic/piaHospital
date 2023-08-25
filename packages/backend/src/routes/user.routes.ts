import express from 'express'
import { UserController } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.route('/login').post(
    (req, res)=>new UserController().login(req, res)
)

userRouter.route('/register').post(
    (req, res)=>new UserController().register(req, res)
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


export default userRouter;