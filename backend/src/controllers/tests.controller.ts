import {Request, Response} from "express";
import { prisma } from "../config/prisma";

export async function getTestController(req:Request, res:Response){
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;

    if(page < 1 || limit <1 || limit > 50){
        return res.status(400).json({
            message: "Invalid page or limit",
        });
    }
    try{
        const totalTest = await prisma.test.findMany({
            where: {
                isActive: true,
            },
            select:{
                id: true,
                name: true,
                description: true,
                price: true,
                duration: true,
                category: true,
            },
            orderBy: {
                category: "asc",
            },
            take: limit,
            skip: (page - 1) * limit,
        });

        const totalPages = Math.ceil(totalTest.length / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return res.status(200).json({
            message: "Tests fetched successfully",
            data: totalTest,
            pagination: {
                currentPage : page,
                limit : limit,
                totalItems : totalTest.length,
                TotalPages : totalPages,
                hasNextPage : hasNextPage,
                hasPreviousPage : hasPreviousPage,
            }
        });
    }catch(error){
        console.error("Error fetching tests:", error);
    }
}