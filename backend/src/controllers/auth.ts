import { Request, Response } from "express";
import z from "zod";
import { prisma } from "../config/prisma"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


const SALT_ROUND = 10

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(4),
})


export async function register(req:Request, res:Response){
    const parsed = registerSchema.safeParse(req.body);
    if(!parsed.success){
    return res.status(400).json({
        message: "Invaild Input",
        errors: parsed.error.flatten(),
    });
    }
    const {email, password, name} = parsed.data;
    try{
        const existinguser = await prisma.user.findUnique({
            where:{email},
        });
        if(existinguser){
            return res.status(409).json({
                message: "email already registerd",
            });
        }
        const hashpassword = await bcrypt.hash(password, SALT_ROUND);
        await prisma.user.create({
            data: {
                email,
                password: hashpassword,
                name,
            },
        });
        return res.status(201).json({
            message:"User register succesfully",
        })
    }catch(err){
        console.error("register error:", err);

        return res.status(500).json({
            message: "Internal sever error",
        });
    }

}
export async function login(req:Request, res:Response){
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
    }
    try{

        const user = await prisma.user.findUnique({
            where:{email},
        })
        if(!user){
            return res.status(401).json({
                message:"Invaild Email or Password"
            })
        }
        const isvalid = await bcrypt.compare(password, user.password)
        
        if(!isvalid){
            return res.status(401).json({
                message:"Invaild Email or Password"
            })
        }
        const token = jwt.sign({
            userId : user.id,
            role: user.role
        },
        process.env.JWT_SECRET as string,
        {
            expiresIn: "1d",
        }
        )
        
        return res.status(200).json({
            message:"Login successfully",
            token
        })
    }catch(err){
        console.error("login error:", err)
        return res.status(500).json({
            message:"Internal Server error"
        })
    }

}

