"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// #region agent log
fetch('http://127.0.0.1:7242/ingest/fecae92a-1ddf-4d2d-9336-69b76fb818c8', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'prisma.ts:1', message: 'Import attempt start', data: { importPath: '../generated/prisma/client' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'post-fix', hypothesisId: 'A' }) }).catch(() => { });
// #endregion
const client_1 = require("../generated/prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const env_1 = require("./env");
// #region agent log
fetch('http://127.0.0.1:7242/ingest/fecae92a-1ddf-4d2d-9336-69b76fb818c8', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'prisma.ts:2', message: 'Imports successful, creating pool and adapter', data: { hasEnv: typeof env_1.env !== 'undefined', hasDIRECT_URL: !!env_1.env.DIRECT_URL }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'post-fix', hypothesisId: 'B' }) }).catch(() => { });
// #endregion
const pool = new pg_1.Pool({ connectionString: env_1.env.DIRECT_URL, ssl: { rejectUnauthorized: false } });
const adapter = new adapter_pg_1.PrismaPg(pool);
// #region agent log
fetch('http://127.0.0.1:7242/ingest/fecae92a-1ddf-4d2d-9336-69b76fb818c8', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'prisma.ts:3', message: 'Before PrismaClient instantiation with adapter', data: { adapterCreated: typeof adapter !== 'undefined' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'post-fix', hypothesisId: 'B' }) }).catch(() => { });
// #endregion
exports.prisma = new client_1.PrismaClient({ adapter });
// #region agent log
fetch('http://127.0.0.1:7242/ingest/fecae92a-1ddf-4d2d-9336-69b76fb818c8', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'prisma.ts:4', message: 'After PrismaClient instantiation', data: { prismaCreated: typeof exports.prisma !== 'undefined', hasUser: typeof exports.prisma?.user !== 'undefined' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'post-fix', hypothesisId: 'A,B,C' }) }).catch(() => { });
// #endregion
//# sourceMappingURL=prisma.js.map