
import { Router } from "express";
import { Request, Response } from "express";
import {login, register} from "../controllers/auth"
import { authMiddleware } from "../middleware/auth.middleware";


const authRouter = Router();

authRouter.post("/signup", register);
authRouter.post("/login", login);

authRouter.get("/profile", authMiddleware, (req:Request, res: Response) => {
    return res.status(200).json({
        userId: req.user?.id,
        role: req.user?.role
    })
})

export default authRouter;
