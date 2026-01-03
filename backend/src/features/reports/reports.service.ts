import { prisma } from "../../config/database";
import { BOOKING_STATUS } from "../../constants/booking-status";
import { CreateReportDTO } from "./reports.validation";
import { NotFoundError, ConflictError, ValidationError, ForbiddenError } from "../../utils/error.util";

export class ReportsService {
    static async create(data: CreateReportDTO, labStaffId: string) {
        const booking = await prisma.booking.findUnique({
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
            throw new NotFoundError("Booking");
        }

        // Check if report already exists
        if (booking.report) {
            throw new ConflictError("Report already exists for this booking");
        }

        // Check if booking is cancelled
        if (booking.status === BOOKING_STATUS.CANCELLED) {
            throw new ValidationError("Cannot upload report for cancelled booking");
        }

        // Use transaction to create report and update booking status
        const result = await prisma.$transaction(async (tx) => {
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
                data: { status: BOOKING_STATUS.COMPLETED },
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

    static async getReport(reportId: string, userId: string, userRole?: string) {
        const report = await prisma.report.findUnique({
            where: { id: reportId },
            include: { booking: true },
        });

        if (!report) {
            throw new NotFoundError("Report");
        }

        if (!report.booking) {
            throw new ValidationError("Report data is incomplete");
        }

        // Global access for ADMIN and LAB_STAFF
        if (userRole === "ADMIN" || userRole === "LAB_STAFF") {
            return report;
        }

        // USER can only access their own reports
        if (userRole === "USER") {
            if (report.booking.userId !== userId) {
                throw new ForbiddenError();
            }
            return report;
        }

        throw new ForbiddenError();
    }
}

