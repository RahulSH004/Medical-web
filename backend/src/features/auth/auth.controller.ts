import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { respondSuccess } from "../../utils/response.util";

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await AuthService.register(req.body);
        return respondSuccess(res, 201, result.message);
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await AuthService.login(req.body);
        return respondSuccess(res, 200, result.message, { token: result.token });
    } catch (error) {
        next(error);
    }
}

