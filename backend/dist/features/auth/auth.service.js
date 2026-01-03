"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = require("../../config/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_util_1 = require("../../utils/jwt.util");
const error_util_1 = require("../../utils/error.util");
const constants_1 = require("../../utils/constants");
class AuthService {
    static async register(data) {
        const existingUser = await database_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new error_util_1.ConflictError("Email already registered");
        }
        const hashPassword = await bcrypt_1.default.hash(data.password, constants_1.SALT_ROUND);
        await database_1.prisma.user.create({
            data: {
                email: data.email,
                passwordHash: hashPassword,
                name: data.name,
                role: "USER"
            },
        });
        return { message: "User registered successfully" };
    }
    static async login(data) {
        const user = await database_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new error_util_1.UnauthorizedError("Invalid Email or Password");
        }
        const isValid = await bcrypt_1.default.compare(data.password, user.passwordHash);
        if (!isValid) {
            throw new error_util_1.UnauthorizedError("Invalid Email or Password");
        }
        const token = (0, jwt_util_1.signToken)({
            sub: user.id,
            role: user.role
        });
        return {
            message: "Login successfully",
            token
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map