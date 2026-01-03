"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTests = getTests;
const tests_service_1 = require("./tests.service");
const response_util_1 = require("../../utils/response.util");
async function getTests(req, res, next) {
    try {
        const result = await tests_service_1.TestsService.getTests(req.query);
        return (0, response_util_1.respondSuccess)(res, 200, "Tests fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=tests.controller.js.map