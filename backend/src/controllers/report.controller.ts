import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";


export async function getReportController(req:Request, res:Response, next:NextFunction){
    
    try{

        const user = req.user!;
        const reportId = req.params.id;
        
        const report = await prisma.report.findUnique({
            where: {id: reportId},
            include: {booking: true},
        })
        if(!report){
            return res.status(404).json({message:"Report Not Found"})
        }
        if (!report.booking) {
            return res.status(500).json({ message: "Report data is incomplete" });
        }
        //Global access
        if(
        user.role === "ADMIN" ||
        user.role === "LAB_STAFF"
        ){
        return res.json(report)
        }
    
        if(user.role === "USER"){
        if(report.booking.userId != user.id){
            return res.status(403).json({message:"Forbidden"})
        }
        return res.json(report);
        }
    
        return res.status(403).json({ message: "Forbidden" });
    }catch(err){
        return res.status(500).json({message: "Something went wrong"})
    }
}