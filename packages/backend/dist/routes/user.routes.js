"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const userRouter = express_1.default.Router();
userRouter.route('/login').post((req, res) => new user_controller_1.UserController().login(req, res));
userRouter.route('/register').post((req, res) => new user_controller_1.UserController().register(req, res));
userRouter.route('/getAllDoctors').get((req, res) => new user_controller_1.UserController().getAllDoctors(req, res));
userRouter.route('/changePassword').post((req, res) => new user_controller_1.UserController().changePassword(req, res));
userRouter.route('/getLoggedInUser').post((req, res) => new user_controller_1.UserController().getLoggedInUser(req, res));
userRouter.route('/updateUserProfile').post((req, res) => new user_controller_1.UserController().updateUserProfile(req, res));
userRouter.route('/findAppointment').post((req, res) => new user_controller_1.UserController().findAppointment(req, res));
exports.default = userRouter;
//# sourceMappingURL=user.routes.js.map