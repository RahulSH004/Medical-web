"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const authrouter = (0, express_1.Router)();
authrouter.post("/signup", auth_1.register);
exports.default = authrouter;
//# sourceMappingURL=auth.routes.js.map