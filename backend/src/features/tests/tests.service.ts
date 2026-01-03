import { prisma } from "../../config/database";
import { ValidationError } from "../../utils/error.util";
import { GetTestsQueryDTO } from "./tests.validation";
import { PaginatedTestsResponse } from "./tests.types";

export class TestsService {
    static async getTests(query: GetTestsQueryDTO): Promise<PaginatedTestsResponse> {
        const page = query.page || 1;
        const limit = query.limit || 12;

        if (page < 1 || limit < 1 || limit > 50) {
            throw new ValidationError("Invalid page or limit");
        }

        const tests = await prisma.test.findMany({
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

