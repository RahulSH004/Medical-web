import { Router } from "express";
import { getLabBookingsController } from "../controllers/lab.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbac } from "../rbac/permission/rbac.middleware";
import { PERMISSIONS } from "../rbac/permission/permission";
import { createReportsController } from "../controllers/create_reports.controller";

const labRoute = Router();

labRoute.get(
    "/lab/bookings",
    authMiddleware,
    rbac([PERMISSIONS.BOOKING_VIEW_ALL]),
    getLabBookingsController
);
labRoute.post(
    "/lab/reports",
    authMiddleware,
    rbac([PERMISSIONS.REPORT_UPLOAD]),
    createReportsController
  );

export default labRoute;