"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabBookings = getLabBookings;
const lab_service_1 = require("./lab.service");
const response_util_1 = require("../../utils/response.util");
async function getLabBookings(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const statusFilter = req.query.status;
        const result = await lab_service_1.LabService.getBookings(page, limit, statusFilter);
        return (0, response_util_1.respondSuccess)(res, 200, "Bookings retrieved successfully", result);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=lab.controller.js.map