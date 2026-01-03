"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const database_1 = require("../../config/database");
const booking_status_1 = require("../../constants/booking-status");
const error_util_1 = require("../../utils/error.util");
class ReportsService {
    static async create(data, labStaffId) {
        const booking = await database_1.prisma.booking.findUnique({
            where: { id: data.bookingId },
            include: {
                report: true,
                test: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!booking) {
            throw new error_util_1.NotFoundError("Booking");
        }
        // Check if report already exists
        if (booking.report) {
            throw new error_util_1.ConflictError("Report already exists for this booking");
        }
        // Check if booking is cancelled
        if (booking.status === booking_status_1.BOOKING_STATUS.CANCELLED) {
            throw new error_util_1.ValidationError("Cannot upload report for cancelled booking");
        }
        // Use transaction to create report and update booking status
        const result = await database_1.prisma.$transaction(async (tx) => {
            const report = await tx.report.create({
                data: {
                    bookingId: data.bookingId,
                    fileUrl: data.fileUrl,
                    remarks: data.remarks,
                    uploadedBy: labStaffId,
                },
            });
            const updateBooking = await tx.booking.update({
                where: { id: data.bookingId },
                data: { status: booking_status_1.BOOKING_STATUS.COMPLETED },
            });
            return { report, updateBooking };
        });
        return {
            report: {
                id: result.report.id,
                bookingId: result.report.bookingId,
                fileUrl: result.report.fileUrl,
                remarks: result.report.remarks,
                uploadedBy: result.report.uploadedBy,
                createdAt: result.report.createdAt,
            },
            booking: {
                id: result.updateBooking.id,
                status: result.updateBooking.status,
                patient: result.updateBooking.userId,
                test: result.updateBooking.testId,
            },
        };
    }
    static async getReport(reportId, userId, userRole) {
        const report = await database_1.prisma.report.findUnique({
            where: { id: reportId },
            include: { booking: true },
        });
        if (!report) {
            throw new error_util_1.NotFoundError("Report");
        }
        if (!report.booking) {
            throw new error_util_1.ValidationError("Report data is incomplete");
        }
        // Global access for ADMIN and LAB_STAFF
        if (userRole === "ADMIN" || userRole === "LAB_STAFF") {
            return report;
        }
        // USER can only access their own reports
        if (userRole === "USER") {
            if (report.booking.userId !== userId) {
                throw new error_util_1.ForbiddenError();
            }
            return report;
        }
        throw new error_util_1.ForbiddenError();
    }
}
exports.ReportsService = ReportsService;
//# sourceMappingURL=reports.service.js.map