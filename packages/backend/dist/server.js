"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
mongoose_1.default.connect('mongodb://localhost:27017/hospital2023');
const connection = mongoose_1.default.connection;
connection.once('open', () => {
    console.log('db connected');
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/users', user_routes_1.default);
app.listen(4000, () => console.info('Running.'));
//# sourceMappingURL=server.js.map