import express from 'express'
import type {Application} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import './db/index.ts'

//Load env variables first - before anything else
dotenv.config();
const app: Application = express();
app.use(cors({
    origin: 'http://localhost:5173', //Vite default port
    credentials: true
}));
app.use(express.json());  // Parse incoming JSON requests
app.get('/health',(req,res)=>{
    res.json({
        status: 'OK',
        message: "EduFlow server is running",
        timeStamp: new Date().toISOString()
    })
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on [http://localhost:${PORT}] (${process.env.NODE_ENV})`));


export default app
