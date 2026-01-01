import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { BookingStatus } from "../generated/prisma/enums";

export async function getLabBookingsController(req:Request, res:Response, next:NextFunction){
    try{

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const statusFilter = req.query.status as string | undefined;

        //pagination
        if(page < 1 || limit < 1 || limit > 50){
            return res.status(400).json({
                message: "Invalid page or limit",
            })
        }
        //selct query 
        const whereClause: any = {};
        if(statusFilter){
            //filter
            const upperStatus = statusFilter.toUpperCase();
            if(!Object.values(BookingStatus).includes(upperStatus as BookingStatus)){
                return res.status(201).json({
                    message: `Invalid status. Must be one of: ${Object.values(BookingStatus).join(", ")}`,
                })
            }
            whereClause.status = upperStatus as BookingStatus;
            
        }

        const skip = (page - 1)*limit;
        const totalbookings = await prisma.booking.count({
            where: whereClause,
        })
        // get all bookings via use select not include 
        const bookings = await prisma.booking.findMany({
            where: whereClause,
            select:{
                id: true,
                collectionDate: true,
                collectionTime: true,
                status: true,
                createdAt: true,
                user: {
                    select:{
                        id: true,
                        name: true,
                    },
                },
                test: {
                    select:{
                        id: true,
                        name: true,
                        category: true,
                        price: true,
                        duration: true,
                    },
                },
                report:{
                    select:{
                        id: true,
                        createdAt: true,
                        uploadedBy: true,
                    },
                },
            },
            orderBy:{
                createdAt: "desc",
            },
            skip: skip,
            take: limit,
        })
        // total pages needed 
        const totalPages = Math.ceil(totalbookings / limit)
        //return the data and the pagination for frontend part very benfincal 
        return res.status(200).json({
            message: "Bookings retrieved successfully",
            data: bookings,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                limit: limit,
                totalbookings: totalbookings,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
            filter: statusFilter ? {status: statusFilter.toUpperCase()}: null,
        });
    }catch(err){
        console.error("get lab bookings error:", err);
        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
}