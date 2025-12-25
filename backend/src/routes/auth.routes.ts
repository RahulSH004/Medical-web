
import { Router } from "express";
import { Request, Response } from "express";
import {login, register} from "../controllers/auth"
import { authMiddleware } from "../middleware/auth.middleware";


const authrouter = Router();

authrouter.post("/signup", register);
authrouter.post("/login", login);

authrouter.get("/home", authMiddleware, (req:Request, res: Response) => {
    return res.status(200).json({
        userId: req.user?.userId,
        role: req.user?.role
    })
})

export default authrouter;
