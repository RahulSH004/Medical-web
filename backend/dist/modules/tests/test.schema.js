"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestsQuerySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.getTestsQuerySchema = zod_1.default.object({
    page: zod_1.default.string().optional().transform((val) => val ? parseInt(val) : 1),
    limit: zod_1.default.string().optional().transform((val) => val ? parseInt(val) : 12),
});
//# sourceMappingURL=test.schema.js.map