import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { BookingStatus } from "../generated/prisma/enums";
import z from "zod";

export async function getMyBookingsController(req: Request, res: Response){
    try{
        const userId = req.user!.id;
        if (!userId) {
            return res.status(401).json({
              message: "User not authenticated",
            });
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const statusFilter = req.query.status as string | undefined;

        // Validate pagination
        if (page < 1 || limit < 1 || limit > 50) {
            return res.status(400).json({
                message: "Invalid pagination parameters. Limit max 50 for user bookings",
            });
        }

        const whereClause: any = {
            userId: userId,
        }
        if (statusFilter) {
            const upperStatus = statusFilter.toUpperCase();
      
            if (!Object.values(BookingStatus).includes(upperStatus as BookingStatus)) {
              return res.status(400).json({
                message: `Invalid status. Must be one of: ${Object.values(BookingStatus).join(", ")}`,
              });
            }
      
            whereClause.status = upperStatus as BookingStatus;
          }
      
        const skip = (page - 1) * limit;

        const totalBookings = await prisma.booking.count({
            where: whereClause,
          });

            // Fetch user's bookings with related data
        const bookings = await prisma.booking.findMany({
            where: whereClause,
            select: {
                id: true,
                collectionDate: true,
                collectionTime: true,
                status: true,
                createdAt: true,
                // Include test details
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
                // Include report if exists
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
            createdAt: "desc", // Newest bookings first
            },
            skip: skip,
            take: limit,
        });

        const totalPages = Math.ceil(totalBookings / limit);

        // Return response
        return res.status(200).json({
          message: "Bookings retrieved successfully",
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
        });
    }catch(error){
        console.error("Error fetching user bookings:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}