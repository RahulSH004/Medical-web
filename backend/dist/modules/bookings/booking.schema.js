"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailabilitySchema = exports.createBookingSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createBookingSchema = zod_1.default.object({
    testId: zod_1.default.string().min(1),
    collectionDate: zod_1.default.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    collectionTime: zod_1.default.string().regex(/^\d{2}:\d{2}$/),
});
exports.getAvailabilitySchema = zod_1.default.object({
    date: zod_1.default.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
//# sourceMappingURL=booking.schema.js.map