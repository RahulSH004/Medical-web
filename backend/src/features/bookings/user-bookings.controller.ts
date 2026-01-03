import { Request, Response, NextFunction } from "express";
import { BookingsService } from "./bookings.service";
import { respondSuccess } from "../../utils/response.util";
import { UnauthorizedError } from "../../utils/error.util";

export async function getUserBookings(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedError("User not authenticated");
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const statusFilter = req.query.status as string | undefined;

        const result = await BookingsService.getUserBookings(userId, page, limit, statusFilter);
        return respondSuccess(res, 200, "Bookings retrieved successfully", result);
    } catch (error) {
        next(error);
    }
}

