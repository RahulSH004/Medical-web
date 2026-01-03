import { Request, Response, NextFunction } from "express";
import { TestsService } from "./tests.service";
import { respondSuccess } from "../../utils/response.util";

export async function getTests(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await TestsService.getTests(req.query as any);
        return respondSuccess(res, 200, "Tests fetched successfully", result);
    } catch (error) {
        next(error);
    }
}

