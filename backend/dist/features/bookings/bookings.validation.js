"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBookingsQuerySchema = exports.getAvailabilityQuerySchema = exports.createBookingSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createBookingSchema = zod_1.default.object({
    testId: zod_1.default.string().min(1),
    collectionDate: zod_1.default.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    collectionTime: zod_1.default.string().regex(/^\d{2}:\d{2}$/),
});
exports.getAvailabilityQuerySchema = zod_1.default.object({
    date: zod_1.default.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    data: zod_1.default.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
}).refine((data) => data.date || data.data, {
    message: "Either date or data parameter is required",
});
exports.getUserBookingsQuerySchema = zod_1.default.object({
    page: zod_1.default.string().optional().transform((val) => val ? parseInt(val) : 1),
    limit: zod_1.default.string().optional().transform((val) => val ? parseInt(val) : 10),
    status: zod_1.default.string().optional(),
});
//# sourceMappingURL=bookings.validation.js.map