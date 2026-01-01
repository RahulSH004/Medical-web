import { Router } from "express";
import { getLabBookingsController } from "../controllers/lab.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbac } from "../rbac/permission/rbac.middleware";
import { PERMISSIONS } from "../rbac/permission/permission";

const labbookingroute = Router();

labbookingroute.get(
    "/lab/bookings",
    authMiddleware,
    rbac([PERMISSIONS.BOOKING_VIEW_ALL]),
    getLabBookingsController
);

export default labbookingroute;