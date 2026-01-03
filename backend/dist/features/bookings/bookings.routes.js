"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookings_controller_1 = require("./bookings.controller");
const availability_controller_1 = require("./availability.controller");
const user_bookings_controller_1 = require("./user-bookings.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rbac_middleware_1 = require("../../rbac/rbac.middleware");
const permission_1 = require("../../rbac/permission");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const validate_middleware_2 = require("../../middleware/validate.middleware");
const bookings_validation_1 = require("./bookings.validation");
const bookingsRouter = (0, express_1.Router)();
bookingsRouter.post("/my/bookings-create", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.rbac)(permission_1.PERMISSIONS.BOOKING_CREATE), (0, validate_middleware_1.validate)(bookings_validation_1.createBookingSchema), bookings_controller_1.createBooking);
bookingsRouter.get("/my/bookings", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.rbac)([permission_1.PERMISSIONS.BOOKING_VIEW_OWN]), (0, validate_middleware_2.validateQuery)(bookings_validation_1.getUserBookingsQuerySchema), user_bookings_controller_1.getUserBookings);
bookingsRouter.get("/my/bookings-create/availability", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.rbac)(permission_1.PERMISSIONS.BOOKING_CREATE), (0, validate_middleware_2.validateQuery)(bookings_validation_1.getAvailabilityQuerySchema), availability_controller_1.getAvailability);
exports.default = bookingsRouter;
//# sourceMappingURL=bookings.routes.js.map