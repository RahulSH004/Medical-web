import { Request, Response } from "express";
import z from "zod";
import { prisma } from "../config/prisma";

const createreportSchema  = z.object({
    bookingId: z.string().min(1),
    fileUrl: z.string().url(),
    remarks: z.string()
})

export async function createReportsController(req: Request, res: Response){
    try{
        const parsed  = createreportSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({
                message:"Invaild Input",
                errors: parsed.error.flatten(),
            });
        }

        const { bookingId , fileUrl , remarks} = parsed.data;
        const LabStaffId = req.user!.id;
        if(!LabStaffId){
            return res.status(401).json({
                message: "Not Authenticated"
            })
        }

        const booking  = await prisma.booking.findUnique({
            where: {id: bookingId},
            include:{
                report: true,
                test:{
                    select:{
                        id: true,
                        name: true,
                    },
                },
                user:{
                    select:{
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if(!booking){
            return res.status(404).json({
                message:"Booking Not Found",
            });
        }

        // if report is already exist 
        if(booking.report){
            return res.status(400).json({
                message:"Report already exists for this booking",
                existingReport:{
                    id: booking.report.id,
                    uploadAt: booking.report.updatedAt,
                },
            });
        }
        //checking if booking is callenced 
        if(booking.status === "CANCELLED"){
            return res.status(400).json({
                message: "Cannot upload report for cancelled booking",
            })
        }
        // use trancation concept here 
        const result = await prisma.$transaction(async(tx) => {
            //create report 
            const report = await tx.report.create({
                data:{
                    bookingId: bookingId,
                    fileUrl: fileUrl,
                    remarks: remarks,
                    uploadedBy: LabStaffId,
                },
            });
            // Update booking status to COMPLETED
            const updateBooking = await tx.booking.update({
                where: {id: bookingId},
                data: {status: "COMPLETED"},
            })
            return {report , updateBooking};
        })

        return res.status(200).json({
            message:"Report uploaded successfully",
            report:{
                id: result.report.id,
                bookingId: result.report.bookingId,
                fileUrl: result.report.fileUrl,
                remarks: result.report.remarks,
                uploadedBy: result.report.uploadedBy,
                createdAt: result.report.createdAt,
            },
            booking:{
                id: result.updateBooking.id,
                status: result.updateBooking.status,
                patient: result.updateBooking.userId,
                test: result.updateBooking.testId,
            },
        });
    }catch(error){
        console.error("Error creating report:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}