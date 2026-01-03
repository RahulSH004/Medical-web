import { Router } from "express";
import { createBookingController } from "../controllers/booking.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbac } from "../rbac/permission/rbac.middleware";
import { PERMISSIONS } from "../rbac/permission/permission";
import { getMyBookingsController } from "../controllers/user_getbooking.controller";
import { getAvailablityBookingcontroller } from "../controllers/get_availableslot.controller";

const bookingRouter = Router();

bookingRouter.post("/my/bookings-create",
    authMiddleware,
    rbac(PERMISSIONS.BOOKING_CREATE),
    createBookingController
);
bookingRouter.get(
    "/my/bookings",
    authMiddleware,
    rbac([PERMISSIONS.BOOKING_VIEW_OWN]),
    getMyBookingsController
  );

bookingRouter.get(
    "/my/bookings-create/availaiblity",
    authMiddleware,
    rbac(PERMISSIONS.BOOKING_CREATE),
    getAvailablityBookingcontroller
)
export default bookingRouter;