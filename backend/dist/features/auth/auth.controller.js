"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const auth_service_1 = require("./auth.service");
const response_util_1 = require("../../utils/response.util");
async function register(req, res, next) {
    try {
        const result = await auth_service_1.AuthService.register(req.body);
        return (0, response_util_1.respondSuccess)(res, 201, result.message);
    }
    catch (error) {
        next(error);
    }
}
async function login(req, res, next) {
    try {
        const result = await auth_service_1.AuthService.login(req.body);
        return (0, response_util_1.respondSuccess)(res, 200, result.message, { token: result.token });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=auth.controller.js.map