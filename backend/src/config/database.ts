import { PrismaClient } from '../generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from './env';

const pool = new Pool({ 
    connectionString: env.DIRECT_URL, 
    ssl: { rejectUnauthorized: false } 
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

