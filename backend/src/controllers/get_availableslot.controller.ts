import { Request, Response } from "express";
import { BOOKING_CONFIG } from "../config/booking.config";
import { prisma } from "../config/prisma";

export async function getAvailablityBookingcontroller(req: Request, res: Response){
    try{
        const date = req.query.data as string;

        if(!date) {
            return res.status(400).json({
                message: "Date parameter is required",
            })
        }

        const requestedDate = new Date(date);

        const slotWithAvailability = await Promise.all(
            BOOKING_CONFIG.AVAILABLE_TIME_SLOTS.map(async(slot) => {
                const bookingcount = await prisma.booking.count({
                    where:{
                        collectionDate: requestedDate,
                        collectionTime: slot,
                        status: {
                            notIn: ["CANCELLED"],
                        }
                    }
                })

                const available = bookingcount < BOOKING_CONFIG.LAB_CAPACITY_PER_SLOT;
                const remaining = BOOKING_CONFIG.LAB_CAPACITY_PER_SLOT - bookingcount;

                return{
                    timeSlot: slot,
                    isAvailable: available,
                    totalCapacity: BOOKING_CONFIG.LAB_CAPACITY_PER_SLOT,
                    bookedCount: bookingcount,
                    remainingSlot: remaining > 0 ? remaining : 0 ,
                }
            })
        )
        return res.status(200).json({
            message: "Available slots retrieved successfully",
            date: date,
            slots: slotWithAvailability,
        })
    }catch(error){
        console.error("Error fetching available slots:", error);
        return res.status(500).json({
          message: "Internal server error",
        });
    }
}