"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyBookingsController = getMyBookingsController;
const prisma_1 = require("../../config/prisma");
const booking_status_1 = require("../bookings/booking.status");
async function getMyBookingsController(req, res) {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated",
            });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const statusFilter = req.query.status;
        // Validate pagination
        if (page < 1 || limit < 1 || limit > 50) {
            return res.status(400).json({
                message: "Invalid pagination parameters. Limit max 50 for user bookings",
            });
        }
        const whereClause = {
            userId: userId,
        };
        if (statusFilter) {
            const upperStatus = statusFilter.toUpperCase();
            if (!Object.values(booking_status_1.BookingStatus).includes(upperStatus)) {
                return res.status(400).json({
                    message: `Invalid status. Must be one of: ${Object.values(booking_status_1.BookingStatus).join(", ")}`,
                });
            }
            whereClause.status = upperStatus;
        }
        const skip = (page - 1) * limit;
        const totalBookings = await prisma_1.prisma.booking.count({
            where: whereClause,
        });
        // Fetch user's bookings with related data
        const bookings = await prisma_1.prisma.booking.findMany({
            where: whereClause,
            select: {
                id: true,
                collectionDate: true,
                collectionTime: true,
                status: true,
                createdAt: true,
                // Include test details
                test: {
                    select: {
                        id: true,
                        name: true,
                        category: true,
                        price: true,
                        duration: true,
                        description: true,
                    },
                },
                // Include report if exists
                report: {
                    select: {
                        id: true,
                        fileUrl: true,
                        remarks: true,
                        createdAt: true,
                        uploadedBy: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc", // Newest bookings first
            },
            skip: skip,
            take: limit,
        });
        const totalPages = Math.ceil(totalBookings / limit);
        // Return response
        return res.status(200).json({
            message: "Bookings retrieved successfully",
            data: bookings,
            pagination: {
                currentPage: page,
                limit: limit,
                totalBookings: totalBookings,
                totalPages: totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
            filter: statusFilter ? { status: statusFilter.toUpperCase() } : null,
        });
    }
    catch (error) {
        console.error("Error fetching user bookings:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
//# sourceMappingURL=user.controller.js.map