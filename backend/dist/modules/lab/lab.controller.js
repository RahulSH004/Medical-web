"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabBookingsController = getLabBookingsController;
const prisma_1 = require("../../config/prisma");
const booking_status_1 = require("../bookings/booking.status");
async function getLabBookingsController(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const statusFilter = req.query.status;
        // pagination
        if (page < 1 || limit < 1 || limit > 50) {
            return res.status(400).json({
                message: "Invalid page or limit",
            });
        }
        // select query 
        const whereClause = {};
        if (statusFilter) {
            // filter
            const upperStatus = statusFilter.toUpperCase();
            if (!Object.values(booking_status_1.BookingStatus).includes(upperStatus)) {
                return res.status(400).json({
                    message: `Invalid status. Must be one of: ${Object.values(booking_status_1.BookingStatus).join(", ")}`,
                });
            }
            whereClause.status = upperStatus;
        }
        const skip = (page - 1) * limit;
        const totalbookings = await prisma_1.prisma.booking.count({
            where: whereClause,
        });
        // get all bookings via use select not include 
        const bookings = await prisma_1.prisma.booking.findMany({
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
        // total pages needed 
        const totalPages = Math.ceil(totalbookings / limit);
        // return the data and the pagination for frontend part very beneficial 
        return res.status(200).json({
            message: "Bookings retrieved successfully",
            data: bookings,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                limit: limit,
                totalbookings: totalbookings,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
            filter: statusFilter ? { status: statusFilter.toUpperCase() } : null,
        });
    }
    catch (err) {
        console.error("get lab bookings error:", err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}
//# sourceMappingURL=lab.controller.js.map