import { Router } from "express";
import { createBooking } from "./bookings.controller";
import { getAvailability } from "./availability.controller";
import { getUserBookings } from "./user-bookings.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbac } from "../../rbac/rbac.middleware";
import { PERMISSIONS } from "../../rbac/permission";
import { validate } from "../../middleware/validate.middleware";
import { validateQuery } from "../../middleware/validate.middleware";
import { createBookingSchema, getAvailabilityQuerySchema, getUserBookingsQuerySchema } from "./bookings.validation";

const bookingsRouter = Router();

bookingsRouter.post(
    "/my/bookings-create",
    authMiddleware,
    rbac(PERMISSIONS.BOOKING_CREATE),
    validate(createBookingSchema),
    createBooking
);

bookingsRouter.get(
    "/my/bookings",
    authMiddleware,
    rbac([PERMISSIONS.BOOKING_VIEW_OWN]),
    validateQuery(getUserBookingsQuerySchema),
    getUserBookings
);

bookingsRouter.get(
    "/my/bookings-create/availability",
    authMiddleware,
    rbac(PERMISSIONS.BOOKING_CREATE),
    validateQuery(getAvailabilityQuerySchema),
    getAvailability
);

export default bookingsRouter;

