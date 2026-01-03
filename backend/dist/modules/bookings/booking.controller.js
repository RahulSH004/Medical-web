"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingController = createBookingController;
exports.getAvailabilityBookingController = getAvailabilityBookingController;
const booking_status_1 = require("./booking.status");
const prisma_1 = require("../../config/prisma");
const booking_config_1 = require("../../config/booking.config");
const booking_schema_1 = require("./booking.schema");
const date_1 = require("../../utils/date");
async function createBookingController(req, res) {
    try {
        const parsed = booking_schema_1.createBookingSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid Input",
                errors: parsed.error.flatten(),
            });
        }
        const { testId, collectionDate, collectionTime } = parsed.data;
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        // validate time-slot 
        if (!booking_config_1.BOOKING_CONFIG.AVAILABLE_TIME_SLOTS.includes(collectionTime)) {
            return res.status(400).json({
                message: "Invalid Slot",
                availableSlot: booking_config_1.BOOKING_CONFIG.AVAILABLE_TIME_SLOTS,
            });
        }
        const requestedDate = new Date(collectionDate);
        const now = new Date();
        if (requestedDate < now) {
            return res.status(400).json({
                message: "Cannot Book for past Dates"
            });
        }
        const hoursUntilBooking = (0, date_1.getHoursBetween)(now, requestedDate);
        if (hoursUntilBooking < booking_config_1.BOOKING_CONFIG.MIN_HOURS_BEFORE_BOOKING) {
            return res.status(400).json({
                message: `Bookings must be made at least ${booking_config_1.BOOKING_CONFIG.MIN_HOURS_BEFORE_BOOKING} hours in advance`
            });
        }
        const maxDate = (0, date_1.addDays)(now, booking_config_1.BOOKING_CONFIG.MAX_ADVANCE_BOOKING_DAYS);
        if (requestedDate > maxDate) {
            return res.status(400).json({
                message: `Cannot book more than ${booking_config_1.BOOKING_CONFIG.MAX_ADVANCE_BOOKING_DAYS} days in advance`,
            });
        }
        const test = await prisma_1.prisma.test.findUnique({
            where: {
                id: testId
            },
            select: { id: true, name: true, isActive: true, price: true }
        });
        if (!test) {
            return res.status(404).json({
                message: "Test Not Found",
            });
        }
        if (!test.isActive) {
            return res.status(400).json({
                message: "This test is currently unavailable"
            });
        }
        const existingBooking = await prisma_1.prisma.booking.count({
            where: {
                collectionDate: collectionDate,
                collectionTime: collectionTime,
                status: {
                    notIn: ["CANCELLED"],
                }
            }
        });
        if (existingBooking >= booking_config_1.BOOKING_CONFIG.LAB_CAPACITY_PER_SLOT) {
            return res.status(400).json({
                message: "This time slot is fully Booked",
                requestedSlot: collectionTime,
                requestedDate: collectionDate,
                suggestion: "Please choose different time slot",
            });
        }
        const booking = await prisma_1.prisma.booking.create({
            data: {
                userId: userId,
                testId: testId,
                collectionDate: new Date(collectionDate),
                collectionTime: collectionTime,
                status: booking_status_1.BookingStatus.PENDING
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
        return res.status(201).json({
            message: "Booking created successfully",
            booking: booking,
        });
    }
    catch (err) {
        console.error("create booking error:", err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}
async function getAvailabilityBookingController(req, res) {
    try {
        const date = req.query.data;
        if (!date) {
            return res.status(400).json({
                message: "Date parameter is required",
            });
        }
        const requestedDate = new Date(date);
        const slotWithAvailability = await Promise.all(booking_config_1.BOOKING_CONFIG.AVAILABLE_TIME_SLOTS.map(async (slot) => {
            const bookingcount = await prisma_1.prisma.booking.count({
                where: {
                    collectionDate: requestedDate,
                    collectionTime: slot,
                    status: {
                        notIn: ["CANCELLED"],
                    }
                }
            });
            const available = bookingcount < booking_config_1.BOOKING_CONFIG.LAB_CAPACITY_PER_SLOT;
            const remaining = booking_config_1.BOOKING_CONFIG.LAB_CAPACITY_PER_SLOT - bookingcount;
            return {
                timeSlot: slot,
                isAvailable: available,
                totalCapacity: booking_config_1.BOOKING_CONFIG.LAB_CAPACITY_PER_SLOT,
                bookedCount: bookingcount,
                remainingSlot: remaining > 0 ? remaining : 0,
            };
        }));
        return res.status(200).json({
            message: "Available slots retrieved successfully",
            date: date,
            slots: slotWithAvailability,
        });
    }
    catch (error) {
        console.error("Error fetching available slots:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
//# sourceMappingURL=booking.controller.js.map