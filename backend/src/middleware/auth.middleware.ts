import { Request, Response, NextFunction } from "express";
import  jwt, { JwtPayload }  from "jsonwebtoken";
import { AuthJwtPayload } from "../types/express";


export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
){
    const authheader = req.headers.authorization;
    if(!authheader){
        return res.status(401).json({
            message:"Authorization header missing"
        })
    }
    
    const [type, token] = authheader.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({
        message: "Authorization token invalid",
        });
    }
    try{
        const decode = jwt.verify(
            token,
            process.env.JWT_SECERT as string,
        )as AuthJwtPayload;
        req.user = decode;
        next();
    }catch(err){
        return res.status(401).json({
            message: "Invaild or expired token",
        })
    }
}


