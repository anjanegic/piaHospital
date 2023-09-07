import cors from 'cors';
import mongoose from 'mongoose'
import express, { Request, Response } from 'express';
import userRouter from './routes/user.routes';
import reportRouter from './routes/report.router';
import specializationRouter from './routes/specialization.router';
import multer from 'multer';    


mongoose.connect('mongodb://localhost:27017/hospital2023');
const connection = mongoose.connection
connection.once('open', ()=>{
    console.log('db connected')
})

const app = express();
app.use(express.json());
app.use(cors());

const path = require('path');

const relativePath = '../../frontend/src/assets/';

const absolutePath = path.join(__dirname, relativePath);

const storage = multer.diskStorage({
    destination: absolutePath,
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage });

app.post('/profile', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('Nije pronađena datoteka');
  }
});
  
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/users', userRouter);
app.use('/reports', reportRouter);
app.use('/specializations', specializationRouter);

app.listen(4000, () => console.info('Running.'));
