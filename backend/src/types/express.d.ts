import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role?: string;
      };
    }
  }
}
interface AuthJwtPayload {
  userId: string;
  role?: string;
}