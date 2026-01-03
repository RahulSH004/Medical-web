import { Request, Response, NextFunction } from "express";
import { ReportsService } from "./reports.service";
import { respondSuccess } from "../../utils/response.util";
import { UnauthorizedError } from "../../utils/error.util";

export async function createReport(req: Request, res: Response, next: NextFunction) {
    try {
        const labStaffId = req.user?.id;
        if (!labStaffId) {
            throw new UnauthorizedError("Not Authenticated");
        }

        const result = await ReportsService.create(req.body, labStaffId);
        return respondSuccess(res, 200, "Report uploaded successfully", result);
    } catch (error) {
        next(error);
    }
}

export async function getReport(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.user!;
        const reportId = req.params.id;

        const report = await ReportsService.getReport(reportId, user.id, user.role);
        return respondSuccess(res, 200, "Report retrieved successfully", { report });
    } catch (error) {
        next(error);
    }
}

