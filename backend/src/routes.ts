import { Router } from "express";
import authRoutes from "./features/auth/auth.routes";
import bookingRoutes from "./features/bookings/bookings.routes";
import testRoutes from "./features/tests/tests.routes";
import reportRoutes from "./features/reports/reports.routes";
import labRoutes from "./features/lab/lab.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/bookings", bookingRoutes);
router.use("/tests", testRoutes);
router.use("/reports", reportRoutes);
router.use("/lab", labRoutes);

export default router;

