"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBooking = createBooking;
const bookings_service_1 = require("./bookings.service");
const response_util_1 = require("../../utils/response.util");
const error_util_1 = require("../../utils/error.util");
async function createBooking(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new error_util_1.UnauthorizedError();
        }
        const booking = await bookings_service_1.BookingsService.create(req.body, userId);
        return (0, response_util_1.respondSuccess)(res, 201, "Booking created successfully", { booking });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=bookings.controller.js.map