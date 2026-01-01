import { Router } from "express";
import { createBookingController } from "../controllers/booking.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbac } from "../rbac/permission/rbac.middleware";
import { PERMISSIONS } from "../rbac/permission/permission";

const bookingRouter = Router();

bookingRouter.post("/bookings",
    authMiddleware,
    rbac(PERMISSIONS.BOOKING_CREATE),
    createBookingController
);

export default bookingRouter;