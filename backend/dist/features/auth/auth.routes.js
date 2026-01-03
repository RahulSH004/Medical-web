"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const auth_validation_1 = require("./auth.validation");
const authRouter = (0, express_1.Router)();
authRouter.post("/signup", (0, validate_middleware_1.validate)(auth_validation_1.registerSchema), auth_controller_1.register);
authRouter.post("/login", (0, validate_middleware_1.validate)(auth_validation_1.loginSchema), auth_controller_1.login);
authRouter.get("/profile", auth_middleware_1.authMiddleware, (req, res) => {
    return res.status(200).json({
        success: true,
        data: {
            userId: req.user?.id,
            role: req.user?.role
        }
    });
});
exports.default = authRouter;
//# sourceMappingURL=auth.routes.js.map