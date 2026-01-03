"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = __importDefault(require("zod"));
const envSchema = zod_1.default.object({
    PORT: zod_1.default.coerce.number().default(4000),
    DATABASE_URL: zod_1.default.string().url(),
    DIRECT_URL: zod_1.default.string().url(),
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error(parsedEnv.error.format());
    process.exit(1);
}
exports.env = parsedEnv.data;
//# sourceMappingURL=env.js.map