"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReportController = createReportController;
exports.getReportController = getReportController;
const prisma_1 = require("../../config/prisma");
const report_schema_1 = require("./report.schema");
async function createReportController(req, res) {
    try {
        const parsed = report_schema_1.createReportSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid Input",
                errors: parsed.error.flatten(),
            });
        }
        const { bookingId, fileUrl, remarks } = parsed.data;
        const LabStaffId = req.user.id;
        if (!LabStaffId) {
            return res.status(401).json({
                message: "Not Authenticated"
            });
        }
        const booking = await prisma_1.prisma.booking.findUnique({
            where: { id: bookingId },
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
            return res.status(404).json({
                message: "Booking Not Found",
            });
        }
        // if report already exists 
        if (booking.report) {
            return res.status(409).json({
                message: "Report already exists for this booking",
                existingReport: {
                    id: booking.report.id,
                    uploadAt: booking.report.updatedAt,
                },
            });
        }
        // checking if booking is cancelled 
        if (booking.status === "CANCELLED") {
            return res.status(400).json({
                message: "Cannot upload report for cancelled booking",
            });
        }
        // use transaction concept here 
        const result = await prisma_1.prisma.$transaction(async (tx) => {
            // create report 
            const report = await tx.report.create({
                data: {
                    bookingId: bookingId,
                    fileUrl: fileUrl,
                    remarks: remarks,
                    uploadedBy: LabStaffId,
                },
            });
            // Update booking status to COMPLETED
            const updateBooking = await tx.booking.update({
                where: { id: bookingId },
                data: { status: "COMPLETED" },
            });
            return { report, updateBooking };
        });
        return res.status(200).json({
            message: "Report uploaded successfully",
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
        });
    }
    catch (error) {
        console.error("Error creating report:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
async function getReportController(req, res, next) {
    try {
        const user = req.user;
        const reportId = req.params.id;
        const report = await prisma_1.prisma.report.findUnique({
            where: { id: reportId },
            include: { booking: true },
        });
        if (!report) {
            return res.status(404).json({ message: "Report Not Found" });
        }
        if (!report.booking) {
            return res.status(500).json({ message: "Report data is incomplete" });
        }
        // Global access
        if (user.role === "ADMIN" ||
            user.role === "LAB_STAFF") {
            return res.json(report);
        }
        if (user.role === "USER") {
            if (report.booking.userId != user.id) {
                return res.status(403).json({ message: "Forbidden" });
            }
            return res.json(report);
        }
        return res.status(403).json({ message: "Forbidden" });
    }
    catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}
//# sourceMappingURL=report.controller.js.map