import {Request, Response} from "express";
import z from "zod";
import { BookingStatus } from "../generated/prisma/enums";
import { prisma } from "../config/prisma";
import { BOOKING_CONFIG } from "../config/booking.config";

const createBookingSchema = z.object({
    testId: z.string().min(1),
    collectionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    collectionTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export async function createBookingController(req:Request, res:Response){

    try{
        const parsed = createBookingSchema.safeParse(req.body);
        
        if(!parsed.success){
            return res.status(400).json({
                message: "Invalid Input",
                errors: parsed.error.flatten(),
            })
        }
        const {testId, collectionDate, collectionTime} = parsed.data;
        const userId = req.user!.id;
        if(!userId){
            return res.status(401).json({
                message: "Unauthorized",
            })
        }

        // validate time-slot 
        if(!BOOKING_CONFIG.AVAILABLE_TIME_SLOTS.includes(collectionTime)){
            return res.status(400).json({
                message: "Invaild Slot",
                availableSlot: BOOKING_CONFIG.AVAILABLE_TIME_SLOTS,
            })
        }
        const requestedDate = new Date(collectionDate);
        const now = new Date();

        if(requestedDate < now){
            return res.status(400).json({
                message:"Cannot Book for past Dates"
            })
        }

        //
        const hoursUntilBooking = (requestedDate.getTime() - now.getTime())/(1000*60*60)
        if(hoursUntilBooking < BOOKING_CONFIG.MIN_HOURS_BEFORE_BOOKING){
            return res.status(400).json({
                message:`Bookings must be made at least ${BOOKING_CONFIG.MIN_HOURS_BEFORE_BOOKING} hours in advance`
            })
        }

        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + BOOKING_CONFIG.MAX_ADVANCE_BOOKING_DAYS);
        
        if (requestedDate > maxDate) {
          return res.status(400).json({
            message: `Cannot book more than ${BOOKING_CONFIG.MAX_ADVANCE_BOOKING_DAYS} days in advance`,
          });
        }

        const test = await prisma.test.findUnique({
            where: {
                id: testId
            },
            select: {id: true, name: true, isActive: true, price: true}
        });
        if(!test){
            return res.status(404).json({
                message: "Test Not Found",
            })
        }
        if(!test.isActive){
            return res.status(400).json({
                meassage: "This test is currently unavailable"
            })
        }
        const existingBooking  = await prisma.booking.count({
            where:{
                collectionDate: collectionDate,
                collectionTime: collectionTime,
                status:{
                    notIn: ["CANCELLED"],
                }
            }
        })
        if(existingBooking >= BOOKING_CONFIG.LAB_CAPACITY_PER_SLOT){
            return res.status(400).json({
                messgae: "This time slot is fully Booked",
                requestedSlot: collectionTime,
                requestedDate: collectionDate,
                suggestion: "Please choose diffrent time slot",

            })
        }

        const booking = await prisma.booking.create({
            data:{
                userId: userId,
                testId: testId,
                collectionDate: new Date(collectionDate),
                collectionTime: collectionTime,
                status: BookingStatus.PENDING
            },
            include: {
                test:{
                    select:{
                        id: true,
                        name: true,
                        price: true,
                        duration: true,
                        category: true,
                    },
                },
                user:{
                    select:{
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
        })
    }catch(err){
        console.error("create booking error:", err);
        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
}