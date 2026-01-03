"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lab_controller_1 = require("./lab.controller");
const reports_controller_1 = require("../reports/reports.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rbac_middleware_1 = require("../../rbac/rbac.middleware");
const permission_1 = require("../../rbac/permission");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const reports_validation_1 = require("../reports/reports.validation");
const labRoute = (0, express_1.Router)();
labRoute.get("/lab/bookings", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.rbac)([permission_1.PERMISSIONS.BOOKING_VIEW_ALL]), lab_controller_1.getLabBookings);
labRoute.post("/lab/reports", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.rbac)([permission_1.PERMISSIONS.REPORT_UPLOAD]), (0, validate_middleware_1.validate)(reports_validation_1.createReportSchema), reports_controller_1.createReport);
exports.default = labRoute;
//# sourceMappingURL=lab.routes.js.map