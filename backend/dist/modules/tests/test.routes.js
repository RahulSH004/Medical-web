"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const test_controller_1 = require("./test.controller");
const testsRouter = (0, express_1.Router)();
testsRouter.get("/tests", test_controller_1.getTestController);
exports.default = testsRouter;
//# sourceMappingURL=test.routes.js.map