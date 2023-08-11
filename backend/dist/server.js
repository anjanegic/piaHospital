"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
// import extras from './routes/extras';
// import orders from './routes/orders';
// import users from './routes/users';
(0, mongoose_1.connect)('mongodb://localhost:27017/hospital2023');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', (req, res) => res.send('Hello World!'));
// app.use('/users', users);
// app.use('/orders', orders);
// app.use('/extras', extras);
app.listen(4000, () => console.info('Running.'));
//# sourceMappingURL=server.js.map