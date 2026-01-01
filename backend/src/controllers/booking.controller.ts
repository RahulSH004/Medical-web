import {Request, Response} from "express";
import z from "zod";
import { BookingStatus } from "../generated/prisma/enums";
import { prisma } from "../config/prisma";

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