import cors from 'cors';
import mongoose from 'mongoose'
import express from 'express';
import userRouter from './routes/user.routes';
import reportRouter from './routes/report.router';

mongoose.connect('mongodb://localhost:27017/hospital2023');
const connection = mongoose.connection
connection.once('open', ()=>{
    console.log('db connected')
})

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/users', userRouter);
app.use('/reports', reportRouter);

app.listen(4000, () => console.info('Running.'));
