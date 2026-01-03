import { Router } from "express";
import { getLabBookings } from "./lab.controller";
import { createReport } from "../reports/reports.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbac } from "../../rbac/rbac.middleware";
import { PERMISSIONS } from "../../rbac/permission";
import { validate } from "../../middleware/validate.middleware";
import { createReportSchema } from "../reports/reports.validation";

const labRoute = Router();

labRoute.get(
    "/lab/bookings",
    authMiddleware,
    rbac([PERMISSIONS.BOOKING_VIEW_ALL]),
    getLabBookings
);

labRoute.post(
    "/lab/reports",
    authMiddleware,
    rbac([PERMISSIONS.REPORT_UPLOAD]),
    validate(createReportSchema),
    createReport
);

export default labRoute;

