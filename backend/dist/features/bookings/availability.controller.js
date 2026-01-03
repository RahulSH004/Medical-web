"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailability = getAvailability;
const bookings_service_1 = require("./bookings.service");
const response_util_1 = require("../../utils/response.util");
const error_util_1 = require("../../utils/error.util");
async function getAvailability(req, res, next) {
    try {
        const date = (req.query.date || req.query.data);
        if (!date) {
            throw new error_util_1.ValidationError("Date parameter is required");
        }
        const result = await bookings_service_1.BookingsService.getAvailability(date);
        return (0, response_util_1.respondSuccess)(res, 200, "Available slots retrieved successfully", result);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=availability.controller.js.map