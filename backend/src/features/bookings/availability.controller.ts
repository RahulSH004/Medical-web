import { Request, Response, NextFunction } from "express";
import { BookingsService } from "./bookings.service";
import { respondSuccess } from "../../utils/response.util";
import { ValidationError } from "../../utils/error.util";

export async function getAvailability(req: Request, res: Response, next: NextFunction) {
    try {
        const date = (req.query.date || req.query.data) as string;
        if (!date) {
            throw new ValidationError("Date parameter is required");
        }

        const result = await BookingsService.getAvailability(date);
        return respondSuccess(res, 200, "Available slots retrieved successfully", result);
    } catch (error) {
        next(error);
    }
}

