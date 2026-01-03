"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondError = exports.respondSuccess = void 0;
const respondSuccess = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        success: true,
        message,
        ...(data && { data }),
    });
};
exports.respondSuccess = respondSuccess;
const respondError = (res, statusCode, message, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors }),
    });
};
exports.respondError = respondError;
//# sourceMappingURL=response.util.js.map