"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReport = createReport;
exports.getReport = getReport;
const reports_service_1 = require("./reports.service");
const response_util_1 = require("../../utils/response.util");
const error_util_1 = require("../../utils/error.util");
async function createReport(req, res, next) {
    try {
        const labStaffId = req.user?.id;
        if (!labStaffId) {
            throw new error_util_1.UnauthorizedError("Not Authenticated");
        }
        const result = await reports_service_1.ReportsService.create(req.body, labStaffId);
        return (0, response_util_1.respondSuccess)(res, 200, "Report uploaded successfully", result);
    }
    catch (error) {
        next(error);
    }
}
async function getReport(req, res, next) {
    try {
        const user = req.user;
        const reportId = req.params.id;
        const report = await reports_service_1.ReportsService.getReport(reportId, user.id, user.role);
        return (0, response_util_1.respondSuccess)(res, 200, "Report retrieved successfully", { report });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=reports.controller.js.map