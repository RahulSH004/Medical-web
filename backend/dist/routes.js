"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./features/auth/auth.routes"));
const bookings_routes_1 = __importDefault(require("./features/bookings/bookings.routes"));
const tests_routes_1 = __importDefault(require("./features/tests/tests.routes"));
const reports_routes_1 = __importDefault(require("./features/reports/reports.routes"));
const lab_routes_1 = __importDefault(require("./features/lab/lab.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/bookings", bookings_routes_1.default);
router.use("/tests", tests_routes_1.default);
router.use("/reports", reports_routes_1.default);
router.use("/lab", lab_routes_1.default);
exports.default = router;
//# sourceMappingURL=routes.js.map