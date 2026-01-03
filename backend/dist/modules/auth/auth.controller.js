"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const prisma_1 = require("../../config/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_schema_1 = require("./auth.schema");
const constants_1 = require("../../utils/constants");
async function register(req, res) {
    const parsed = auth_schema_1.registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: "Invalid Input",
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
                message: "email already registered",
            });
        }
        const hashpassword = await bcrypt_1.default.hash(password, constants_1.SALT_ROUND);
        await prisma_1.prisma.user.create({
            data: {
                email,
                passwordHash: hashpassword,
                name,
                role: "USER"
            },
        });
        return res.status(201).json({
            message: "User registered successfully",
        });
    }
    catch (err) {
        console.error("register error:", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
async function login(req, res) {
    try {
        const parsed = auth_schema_1.loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid Input",
                errors: parsed.error.flatten(),
            });
        }
        const { email, password } = parsed.data;
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            });
        }
        const isvalid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isvalid) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            });
        }
        const token = jsonwebtoken_1.default.sign({
            sub: user.id,
            role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return res.status(200).json({
            message: "Login successfully",
            token
        });
    }
    catch (err) {
        console.error("login error:", err);
        return res.status(500).json({
            message: "Internal Server error"
        });
    }
}
//# sourceMappingURL=auth.controller.js.map