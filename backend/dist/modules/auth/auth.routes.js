"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const authRouter = (0, express_1.Router)();
authRouter.post("/signup", auth_controller_1.register);
authRouter.post("/login", auth_controller_1.login);
authRouter.get("/profile", auth_middleware_1.authMiddleware, (req, res) => {
    return res.status(200).json({
        userId: req.user?.id,
        role: req.user?.role
    });
});
exports.default = authRouter;
//# sourceMappingURL=auth.routes.js.map