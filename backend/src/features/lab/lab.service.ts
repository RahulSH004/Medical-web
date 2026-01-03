import { prisma } from "../../config/database";
import { BOOKING_STATUS } from "../../constants/booking-status";
import { ValidationError } from "../../utils/error.util";

export class LabService {
    static async getBookings(page: number, limit: number, statusFilter?: string) {
        if (page < 1 || limit < 1 || limit > 50) {
            throw new ValidationError("Invalid page or limit");
        }

        const whereClause: any = {};
        if (statusFilter) {
            const upperStatus = statusFilter.toUpperCase();
            if (!Object.values(BOOKING_STATUS).includes(upperStatus as any)) {
                throw new ValidationError(
                    `Invalid status. Must be one of: ${Object.values(BOOKING_STATUS).join(", ")}`
                );
            }
            whereClause.status = upperStatus;
        }

        const skip = (page - 1) * limit;
        const totalBookings = await prisma.booking.count({ where: whereClause });

        const bookings = await prisma.booking.findMany({
            where: whereClause,
            select: {
                id: true,
                collectionDate: true,
                collectionTime: true,
                status: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                test: {
                    select: {
                        id: true,
                        name: true,
                        category: true,
                        price: true,
                        duration: true,
                    },
                },
                report: {
                    select: {
                        id: true,
                        createdAt: true,
                        uploadedBy: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: skip,
            take: limit,
        });

        const totalPages = Math.ceil(totalBookings / limit);

        return {
            data: bookings,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                limit: limit,
                totalBookings: totalBookings,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
            filter: statusFilter ? { status: statusFilter.toUpperCase() } : null,
        };
    }
}

