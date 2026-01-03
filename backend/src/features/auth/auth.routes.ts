import { Router, Request, Response } from "express";
import { register, login } from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { registerSchema, loginSchema } from "./auth.validation";

const authRouter = Router();

authRouter.post("/signup", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);

authRouter.get("/profile", authMiddleware, (req: Request, res: Response) => {
    return res.status(200).json({
        success: true,
        data: {
            userId: req.user?.id,
            role: req.user?.role
        }
    });
});

export default authRouter;

