import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { getReport, createReport } from "./reports.controller";
import { rbac } from "../../rbac/rbac.middleware";
import { PERMISSIONS } from "../../rbac/permission";
import { validate } from "../../middleware/validate.middleware";
import { createReportSchema } from "./reports.validation";

const reportRouter = Router();

reportRouter.get(
    "/reports/:id",
    authMiddleware,
    rbac([PERMISSIONS.REPORT_VIEW_OWN, PERMISSIONS.REPORT_VIEW_ALL]),
    getReport
);

export default reportRouter;

