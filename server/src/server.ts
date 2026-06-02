import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import type {Application} from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.ts'
import { notFound, globalHandler } from './middlewares/error.middleware.ts';
import roadmapRoutes from './routes/roadmap.routes.ts'
import progressRoutes from './routes/progress.routes.ts'
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
//LOAD env variables first - before anything else


const app: Application = express();

//Security headers
app.use(helmet());

//CORS - restrict origin, methods and headers
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', //Vite default port
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());  // Parse incoming JSON requests

//Rate Limiter for the AI generate endpoint (Protect GEMINI Quota)
const generateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    message: {success: false, message: 'Too many requests. Please wait a few minutes and try again'},
    standardHeaders: true,
    legacyHeaders: false,
});

app.get('/health',(req,res)=>{
    res.json({
        status: 'OK',
        message: "EduFlow server is running",
        timeStamp: new Date().toISOString()
    })
})

app.use('/api/auth',authRoutes);
app.use('/api/roadmap/generate',generateLimiter);

app.use('/api/roadmap',roadmapRoutes)
app.use('/api/progress',progressRoutes)

app.use(notFound);
app.use(globalHandler);

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
