import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import type {Application} from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.ts'
import { protect } from './middlewares/auth.middleware.ts';
import { notFound, globalHandler } from './middlewares/error.middleware.ts';
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

app.use(notFound);
app.use(globalHandler);

//Protected test route HERE
app.get('/api/protected',protect,(req,res)=>{
    res.json({
        success: true,
        message: 'You accessed a protected route',
        user: req.user
    });
});

const PORT = process.env.PORT || 5000;
const start = async () => {
    await import('./db/index.ts');
    app.listen(PORT, ()=>{
        console.log(`Server running on [ http://localhost:${PORT} ] (${process.env.NODE_ENV}) ....`);
    })
}   
start().catch(error=>{
    console.error(` Failed to start the server ${error}`);
    process.exit(1);
})

export default app
