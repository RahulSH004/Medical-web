import { prisma } from "../../config/database";
import { BOOKING_STATUS } from "../../constants/booking-status";
import { TIME_SLOTS, BOOKING_CONSTANTS } from "../../constants";
import { CreateBookingDTO } from "./bookings.validation";
import { ValidationError, NotFoundError, ConflictError } from "../../utils/error.util";
import { getHoursBetween, addDays } from "../../utils/date.util";

export class BookingsService {
    static async create(data: CreateBookingDTO, userId: string) {
        // Validate time slot
        const timeSlotsArray = Array.from(TIME_SLOTS);
        if (!timeSlotsArray.includes(data.collectionTime as any)) {
            throw new ValidationError("Invalid time slot");
        }

        const requestedDate = new Date(data.collectionDate);
        const now = new Date();

        // Validate date is not in the past
        if (requestedDate < now) {
            throw new ValidationError("Cannot book for past dates");
        }

        // Validate minimum hours before booking
        const hoursUntilBooking = getHoursBetween(now, requestedDate);
        if (hoursUntilBooking < BOOKING_CONSTANTS.MIN_HOURS_BEFORE_BOOKING) {
            throw new ValidationError(
                `Bookings must be made at least ${BOOKING_CONSTANTS.MIN_HOURS_BEFORE_BOOKING} hours in advance`
            );
        }

        // Validate maximum advance booking days
        const maxDate = addDays(now, BOOKING_CONSTANTS.MAX_ADVANCE_BOOKING_DAYS);
        if (requestedDate > maxDate) {
            throw new ValidationError(
                `Cannot book more than ${BOOKING_CONSTANTS.MAX_ADVANCE_BOOKING_DAYS} days in advance`
            );
        }

        // Validate test exists and is active
        const test = await prisma.test.findUnique({
            where: { id: data.testId },
            select: { id: true, name: true, isActive: true, price: true }
        });

        if (!test) {
            throw new NotFoundError("Test");
        }

        if (!test.isActive) {
            throw new ValidationError("This test is currently unavailable");
        }

        // Check capacity
        const existingBooking = await prisma.booking.count({
            where: {
                collectionDate: data.collectionDate,
                collectionTime: data.collectionTime,
                status: {
                    notIn: [BOOKING_STATUS.CANCELLED],
                }
            }
        });

        if (existingBooking >= BOOKING_CONSTANTS.LAB_CAPACITY_PER_SLOT) {
            throw new ConflictError("This time slot is fully booked");
        }

        // Create booking
        const booking = await prisma.booking.create({
            data: {
                userId: userId,
                testId: data.testId,
                collectionDate: new Date(data.collectionDate),
                collectionTime: data.collectionTime,
                status: BOOKING_STATUS.PENDING
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

    static async getAvailability(date: string) {
        const requestedDate = new Date(date);

        const slotWithAvailability = await Promise.all(
            TIME_SLOTS.map(async (slot) => {
                const bookingCount = await prisma.booking.count({
                    where: {
                        collectionDate: requestedDate,
                        collectionTime: slot,
                        status: {
                            notIn: [BOOKING_STATUS.CANCELLED],
                        }
                    }
                });

                const available = bookingCount < BOOKING_CONSTANTS.LAB_CAPACITY_PER_SLOT;
                const remaining = BOOKING_CONSTANTS.LAB_CAPACITY_PER_SLOT - bookingCount;

                return {
                    timeSlot: slot,
                    isAvailable: available,
                    totalCapacity: BOOKING_CONSTANTS.LAB_CAPACITY_PER_SLOT,
                    bookedCount: bookingCount,
                    remainingSlot: remaining > 0 ? remaining : 0,
                };
            })
        );

        return {
            date: date,
            slots: slotWithAvailability,
        };
    }

    static async getUserBookings(userId: string, page: number, limit: number, statusFilter?: string) {
        if (page < 1 || limit < 1 || limit > 50) {
            throw new ValidationError("Invalid pagination parameters. Limit max 50 for user bookings");
        }

        const whereClause: any = { userId: userId };

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

