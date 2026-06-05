import { env } from './config/env.ts'
import express from 'express'
import type {Application} from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.ts'
import { notFound, globalHandler } from './middlewares/error.middleware.ts';
import roadmapRoutes from './routes/roadmap.routes.ts'
import progressRoutes from './routes/progress.routes.ts'
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { logger } from './utils/logger.ts'
import { requestId } from './middlewares/requestId.middleware.ts'
//LOAD env variables first - before anything else


const app: Application = express();

app.disable('x-powered-by');

//Security headers
app.use(helmet());

//CORS - restrict origin, methods and headers
app.use(cors({
    origin: env.CORS_ORIGIN || 'http://localhost:5173', //Vite default port
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({limit: '1mb'}));  // Parse incoming JSON requests
app.use(requestId);

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10 minutes
    max: 20,
    message: {success: false, message: "Too many auth attempts. Please wait and try again"},
    standardHeaders: true,
    legacyHeaders: false,
})

app.get('/health',(req,res)=>{
    res.json({
        status: 'OK',
        message: "EduFlow server is running",
        timeStamp: new Date().toISOString()
    })
})

app.use('/api/auth',authLimiter,authRoutes);


app.use('/api/roadmap',roadmapRoutes)
app.use('/api/progress',progressRoutes)

app.use(notFound);
app.use(globalHandler);

const PORT = Number(env.PORT) || 5000;
const start = async () => {
    const db = await import('./db/index.ts');
    await db.testConnection();
    app.listen(PORT, ()=>{
        logger.info(`Server running on [ http://localhost:${PORT} ] (${env.NODE_ENV}) ....`);
    })
}   
start().catch(error=>{
    logger.error(` Failed to start the server ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
})

export default app
