"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../config/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUND = 10;
const registerSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(8),
    name: zod_1.default.string().min(4),
});
async function register(req, res) {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: "Invaild Input",
            errors: parsed.error.flatten(),
        });
    }
    const { email, password, name } = parsed.data;
    try {
        const existinguser = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (existinguser) {
            return res.status(409).json({
                message: "email already registerd",
            });
        }
        const hashpassword = await bcrypt_1.default.hash(password, SALT_ROUND);
        await prisma_1.prisma.user.create({
            data: {
                email,
                password: hashpassword,
                name,
            },
        });
        return res.status(201).json({
            message: "User register succesfully",
        });
    }
    catch (err) {
        console.error("register error:", err);
        return res.status(500).json({
            message: "Internal sever error",
        });
    }
}
//# sourceMappingURL=auth.js.map