import jwt from "jsonwebtoken";
import { Role } from "../rbac/role";

export interface JwtPayload {
    sub: string;
    role?: Role;
}

export const signToken = (payload: JwtPayload, expiresIn: string = "1d"): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.verify(token, secret) as JwtPayload;
};

