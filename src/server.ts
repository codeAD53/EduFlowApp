import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import type {Application} from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.ts'

//LOAD env variables first - before anything else


const app: Application = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', //Vite default port
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

app.use('/api/auth',authRoutes);

const PORT = process.env.PORT || 5000;
const start = async () => {
    await import('./db/index.ts');
    app.listen(PORT, ()=>{
        console.log(`Server running on [ http://localhost:${PORT} ] (${process.env.NODE_ENV})`);
    })
}   
start().catch(error=>{
    console.error(` Failed to start the server ${error}`);
    process.exit(1);
})

export default app
