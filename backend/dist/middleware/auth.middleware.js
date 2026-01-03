"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const authheader = req.headers.authorization;
    if (!authheader) {
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }
    const [type, token] = authheader.split(" ");
    if (type !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Authorization token invalid",
        });
    }
    try {
        const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decode.sub,
            role: decode.role
        };
        next();
    }
    catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}
//# sourceMappingURL=auth.middleware.js.map