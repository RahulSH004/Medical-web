import { Request, Response } from "express";
import { generateOTP, sendOTP, verifyOTP, saveOTP } from "../services/otpService";
import { userRegistrationSchema, phoneNumberSchema, otpVerificationSchema } from "../utils/validation";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import redis from "../services/redisServices";

const prisma = new PrismaClient();

export const requestOtp = async (req: Request, res: Response) => {
    try{
        const {phoneNumber} = phoneNumberSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({
            where: { phoneNumber }
        });

        if(existingUser) return res.status(400).json({message: "User already exists"});
        
        const otp = generateOTP();
        await saveOTP(phoneNumber, otp);
        await sendOTP(phoneNumber, otp);

        return res.status(200).json({message: "OTP sent successfully"});
    }catch(error){
        return res.status(400).json({error:"Invalid phone number or otp error"});
    }
}

export const verifyOtp = async (req: Request, res: Response) => {
    try{
        const {phoneNumber, otp} = otpVerificationSchema.parse(req.body);
        const isValid = await verifyOTP(phoneNumber, otp);

        if(!isValid) return res.status(400).json({message: "Invalid OTP"});

        return res.status(200).json({message: `OTP verified successfully`});
    }catch(error){
        return res.status(400).json({error: "Invalid phone number or OTP format"});
    }
}
export const register = async (req: Request , res: Response) => {
    try{
        const {phoneNumber, email, firstName, lastName, password, dateOfBirth} = userRegistrationSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({
            where: { phoneNumber }
        });

        if(existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const isVerified = await redis.get(`otp_verified:${phoneNumber}`);
        if (isVerified !== "true") {
            return res.status(403).json({ error: "Phone number not verified via OTP" });
        }

        const user = await prisma.user.create({
            data: {
                phoneNumber,
                email,
                firstName,
                lastName,
                password: hashedPassword,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                role: "PATIENT"
            }
        });

        return res.status(200).json({message: "User registered successfully"});
    }catch(error){
        console.error("Registration error:", error);
        return res.status(400).json({error: "registration Failed"});
    }
}