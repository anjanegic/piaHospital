"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const report_router_1 = __importDefault(require("./routes/report.router"));
const specialization_router_1 = __importDefault(require("./routes/specialization.router"));
const multer_1 = __importDefault(require("multer"));
mongoose_1.default.connect('mongodb://localhost:27017/hospital2023');
const connection = mongoose_1.default.connection;
connection.once('open', () => {
    console.log('db connected');
});
const app = express_1.default();
app.use(express_1.default.json());
app.use(cors_1.default());
const path = require('path');
const relativePath = '../../frontend/src/assets/';
const absolutePath = path.join(__dirname, relativePath);
const storage = multer_1.default.diskStorage({
    destination: absolutePath,
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer_1.default({ storage: storage });
app.post('/profile', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nije pronađena datoteka');
    }
});
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/users', user_routes_1.default);
app.use('/reports', report_router_1.default);
app.use('/specializations', specialization_router_1.default);
app.listen(4000, () => console.info('Running.'));
//# sourceMappingURL=server.js.map