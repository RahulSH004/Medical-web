"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBookings = getUserBookings;
const bookings_service_1 = require("./bookings.service");
const response_util_1 = require("../../utils/response.util");
const error_util_1 = require("../../utils/error.util");
async function getUserBookings(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new error_util_1.UnauthorizedError("User not authenticated");
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const statusFilter = req.query.status;
        const result = await bookings_service_1.BookingsService.getUserBookings(userId, page, limit, statusFilter);
        return (0, response_util_1.respondSuccess)(res, 200, "Bookings retrieved successfully", result);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=user-bookings.controller.js.map