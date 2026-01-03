"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const error_util_1 = require("../utils/error.util");
function errorMiddleware(err, req, res, next) {
    const statusCode = err instanceof error_util_1.AppError ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";
    console.error("Error:", {
        message: err.message,
        stack: err.stack,
        statusCode,
        path: req.path,
        method: req.method,
    });
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
}
//# sourceMappingURL=error.middleware.js.map