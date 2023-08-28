"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const Schema = mongoose_1.default.Schema;
var UserType;
(function (UserType) {
    UserType["Patient"] = "patient";
    UserType["Doctor"] = "doctor";
    UserType["Manager"] = "manager";
})(UserType || (UserType = {}));
const User = new Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    password: {
        type: String
    },
    type: {
        type: String,
        enum: Object.values(UserType)
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    license: {
        type: Number
    },
    specialization: {
        type: String
    },
    branch: {
        type: String
    },
    approved: {
        type: Boolean
    },
    profile_picture: {
        type: String
    },
    appointments: {
        type: Array
    },
    bookedAppointments: {
        type: Array
    }
});
exports.default = mongoose_1.model('Users', User, 'users');
//# sourceMappingURL=user.js.map