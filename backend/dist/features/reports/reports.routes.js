"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const reports_controller_1 = require("./reports.controller");
const rbac_middleware_1 = require("../../rbac/rbac.middleware");
const permission_1 = require("../../rbac/permission");
const reportRouter = (0, express_1.Router)();
reportRouter.get("/reports/:id", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.rbac)([permission_1.PERMISSIONS.REPORT_VIEW_OWN, permission_1.PERMISSIONS.REPORT_VIEW_ALL]), reports_controller_1.getReport);
exports.default = reportRouter;
//# sourceMappingURL=reports.routes.js.map