import { authMiddleware } from "../middleware/auth.middleware";
import { getReportController } from "../controllers/report.controller";
import { Router } from "express";
import { rbac } from "../rbac/permission/rbac.middleware";
import { PERMISSIONS } from "../rbac/permission/permission";

const reportrouter = Router();

reportrouter.get(
    "/reports/:id",
    authMiddleware,
    rbac([PERMISSIONS.REPORT_VIEW_OWN,PERMISSIONS.REPORT_VIEW_ALL]),
    getReportController
)
export default reportrouter;