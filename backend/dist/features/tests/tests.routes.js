"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tests_controller_1 = require("./tests.controller");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const tests_validation_1 = require("./tests.validation");
const testsRouter = (0, express_1.Router)();
testsRouter.get("/tests", (0, validate_middleware_1.validateQuery)(tests_validation_1.getTestsQuerySchema), tests_controller_1.getTests);
exports.default = testsRouter;
//# sourceMappingURL=tests.routes.js.map