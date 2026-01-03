"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("./booking.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rbac_middleware_1 = require("../../rbac/rbac.middleware");
const permission_1 = require("../../rbac/permission");
const user_controller_1 = require("../users/user.controller");
const bookingRouter = (0, express_1.Router)();
bookingRouter.post("/my/bookings-create", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.rbac)(permission_1.PERMISSIONS.BOOKING_CREATE), booking_controller_1.createBookingController);
bookingRouter.get("/my/bookings", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.rbac)([permission_1.PERMISSIONS.BOOKING_VIEW_OWN]), user_controller_1.getMyBookingsController);
bookingRouter.get("/my/bookings-create/availability", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.rbac)(permission_1.PERMISSIONS.BOOKING_CREATE), booking_controller_1.getAvailabilityBookingController);
exports.default = bookingRouter;
//# sourceMappingURL=booking.routes.js.map