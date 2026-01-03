"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReportSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createReportSchema = zod_1.default.object({
    bookingId: zod_1.default.string().min(1),
    fileUrl: zod_1.default.string().url(),
    remarks: zod_1.default.string()
});
//# sourceMappingURL=reports.validation.js.map