"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const database_1 = require("../../config/database");
const booking_status_1 = require("../../constants/booking-status");
const constants_1 = require("../../constants");
const error_util_1 = require("../../utils/error.util");
const date_util_1 = require("../../utils/date.util");
class BookingsService {
    static async create(data, userId) {
        // Validate time slot
        const timeSlotsArray = Array.from(constants_1.TIME_SLOTS);
        if (!timeSlotsArray.includes(data.collectionTime)) {
            throw new error_util_1.ValidationError("Invalid time slot");
        }
        const requestedDate = new Date(data.collectionDate);
        const now = new Date();
        // Validate date is not in the past
        if (requestedDate < now) {
            throw new error_util_1.ValidationError("Cannot book for past dates");
        }
        // Validate minimum hours before booking
        const hoursUntilBooking = (0, date_util_1.getHoursBetween)(now, requestedDate);
        if (hoursUntilBooking < constants_1.BOOKING_CONSTANTS.MIN_HOURS_BEFORE_BOOKING) {
            throw new error_util_1.ValidationError(`Bookings must be made at least ${constants_1.BOOKING_CONSTANTS.MIN_HOURS_BEFORE_BOOKING} hours in advance`);
        }
        // Validate maximum advance booking days
        const maxDate = (0, date_util_1.addDays)(now, constants_1.BOOKING_CONSTANTS.MAX_ADVANCE_BOOKING_DAYS);
        if (requestedDate > maxDate) {
            throw new error_util_1.ValidationError(`Cannot book more than ${constants_1.BOOKING_CONSTANTS.MAX_ADVANCE_BOOKING_DAYS} days in advance`);
        }
        // Validate test exists and is active
        const test = await database_1.prisma.test.findUnique({
            where: { id: data.testId },
            select: { id: true, name: true, isActive: true, price: true }
        });
        if (!test) {
            throw new error_util_1.NotFoundError("Test");
        }
        if (!test.isActive) {
            throw new error_util_1.ValidationError("This test is currently unavailable");
        }
        // Check capacity
        const existingBooking = await database_1.prisma.booking.count({
            where: {
                collectionDate: data.collectionDate,
                collectionTime: data.collectionTime,
                status: {
                    notIn: [booking_status_1.BOOKING_STATUS.CANCELLED],
                }
            }
        });
        if (existingBooking >= constants_1.BOOKING_CONSTANTS.LAB_CAPACITY_PER_SLOT) {
            throw new error_util_1.ConflictError("This time slot is fully booked");
        }
        // Create booking
        const booking = await database_1.prisma.booking.create({
            data: {
                userId: userId,
                testId: data.testId,
                collectionDate: new Date(data.collectionDate),
                collectionTime: data.collectionTime,
                status: booking_status_1.BOOKING_STATUS.PENDING
            },
            include: {
                test: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        duration: true,
                        category: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });
        return booking;
    }
    static async getAvailability(date) {
        const requestedDate = new Date(date);
        const slotWithAvailability = await Promise.all(constants_1.TIME_SLOTS.map(async (slot) => {
            const bookingCount = await database_1.prisma.booking.count({
                where: {
                    collectionDate: requestedDate,
                    collectionTime: slot,
                    status: {
                        notIn: [booking_status_1.BOOKING_STATUS.CANCELLED],
                    }
                }
            });
            const available = bookingCount < constants_1.BOOKING_CONSTANTS.LAB_CAPACITY_PER_SLOT;
            const remaining = constants_1.BOOKING_CONSTANTS.LAB_CAPACITY_PER_SLOT - bookingCount;
            return {
                timeSlot: slot,
                isAvailable: available,
                totalCapacity: constants_1.BOOKING_CONSTANTS.LAB_CAPACITY_PER_SLOT,
                bookedCount: bookingCount,
                remainingSlot: remaining > 0 ? remaining : 0,
            };
        }));
        return {
            date: date,
            slots: slotWithAvailability,
        };
    }
    static async getUserBookings(userId, page, limit, statusFilter) {
        if (page < 1 || limit < 1 || limit > 50) {
            throw new error_util_1.ValidationError("Invalid pagination parameters. Limit max 50 for user bookings");
        }
        const whereClause = { userId: userId };
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
                limit: limit,
                totalBookings: totalBookings,
                totalPages: totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
            filter: statusFilter ? { status: statusFilter.toUpperCase() } : null,
        };
    }
}
exports.BookingsService = BookingsService;
//# sourceMappingURL=bookings.service.js.map