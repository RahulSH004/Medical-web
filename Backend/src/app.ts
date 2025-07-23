import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import asyncHandler from 'express-async-handler';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRouters from './routes/Authroute';

dotenv.config();
const prisma = new PrismaClient()
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
})
app.use(limiter);

app.use('/api', authRouters);

async function startServer() {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
startServer();
