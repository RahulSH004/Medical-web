"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabService = void 0;
const database_1 = require("../../config/database");
const booking_status_1 = require("../../constants/booking-status");
const error_util_1 = require("../../utils/error.util");
class LabService {
    static async getBookings(page, limit, statusFilter) {
        if (page < 1 || limit < 1 || limit > 50) {
            throw new error_util_1.ValidationError("Invalid page or limit");
        }
        const whereClause = {};
        if (statusFilter) {
            const upperStatus = statusFilter.toUpperCase();
            if (!Object.values(booking_status_1.BOOKING_STATUS).includes(upperStatus)) {
                throw new error_util_1.ValidationError(`Invalid status. Must be one of: ${Object.values(booking_status_1.BOOKING_STATUS).join(", ")}`);
            }
            whereClause.status = upperStatus;
        }
        const skip = (page - 1) * limit;
        const totalBookings = await database_1.prisma.booking.count({ where: whereClause });
        const bookings = await database_1.prisma.booking.findMany({
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
exports.LabService = LabService;
//# sourceMappingURL=lab.service.js.map