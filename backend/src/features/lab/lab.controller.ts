import { Request, Response, NextFunction } from "express";
import { LabService } from "./lab.service";
import { respondSuccess } from "../../utils/response.util";

export async function getLabBookings(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const statusFilter = req.query.status as string | undefined;

        const result = await LabService.getBookings(page, limit, statusFilter);
        return respondSuccess(res, 200, "Bookings retrieved successfully", result);
    } catch (error) {
        next(error);
    }
}

