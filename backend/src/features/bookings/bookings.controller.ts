import { Request, Response, NextFunction } from "express";
import { BookingsService } from "./bookings.service";
import { respondSuccess } from "../../utils/response.util";
import { UnauthorizedError } from "../../utils/error.util";

export async function createBooking(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedError();
        }

        const booking = await BookingsService.create(req.body, userId);
        return respondSuccess(res, 201, "Booking created successfully", { booking });
    } catch (error) {
        next(error);
    }
}

