"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestsService = void 0;
const database_1 = require("../../config/database");
const error_util_1 = require("../../utils/error.util");
class TestsService {
    static async getTests(query) {
        const page = query.page || 1;
        const limit = query.limit || 12;
        if (page < 1 || limit < 1 || limit > 50) {
            throw new error_util_1.ValidationError("Invalid page or limit");
        }
        const tests = await database_1.prisma.test.findMany({
            where: {
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                duration: true,
                category: true,
            },
            orderBy: {
                category: "asc",
            },
            take: limit,
            skip: (page - 1) * limit,
        });
        const totalItems = tests.length;
        const totalPages = Math.ceil(totalItems / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;
        return {
            data: tests,
            pagination: {
                currentPage: page,
                limit: limit,
                totalItems: totalItems,
                totalPages: totalPages,
                hasNextPage: hasNextPage,
                hasPreviousPage: hasPreviousPage,
            }
        };
    }
}
exports.TestsService = TestsService;
//# sourceMappingURL=tests.service.js.map