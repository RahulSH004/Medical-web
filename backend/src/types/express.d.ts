import "express";
import { Role } from "../rbac/role";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role?: Role;
      };
    }
  }
}
interface AuthJwtPayload {
  sub: string;
  role?: Role;
}