"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestController = getTestController;
const prisma_1 = require("../../config/prisma");
const constants_1 = require("../../utils/constants");
async function getTestController(req, res) {
    const page = parseInt(req.query.page) || constants_1.PAGINATION.DEFAULT_TEST_LIMIT;
    const limit = parseInt(req.query.limit) || constants_1.PAGINATION.DEFAULT_TEST_LIMIT;
    if (page < 1 || limit < 1 || limit > constants_1.PAGINATION.MAX_LIMIT) {
        return res.status(400).json({
            message: "Invalid page or limit",
        });
    }
    try {
        const totalTest = await prisma_1.prisma.test.findMany({
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
        const totalPages = Math.ceil(totalTest.length / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;
        return res.status(200).json({
            message: "Tests fetched successfully",
            data: totalTest,
            pagination: {
                currentPage: page,
                limit: limit,
                totalItems: totalTest.length,
                totalPages: totalPages,
                hasNextPage: hasNextPage,
                hasPreviousPage: hasPreviousPage,
            }
        });
    }
    catch (error) {
        console.error("Error fetching tests:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
//# sourceMappingURL=test.controller.js.map