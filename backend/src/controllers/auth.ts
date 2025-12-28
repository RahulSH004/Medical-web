import { Request, Response } from "express";
import z, { email } from "zod";
import { prisma } from "../config/prisma"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { Role } from "../generated/prisma/enums";


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
                passwordHash: hashpassword,
                name,
                role: "USER"
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

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
})
export async function login(req:Request, res:Response){

    try{
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid Input",
          errors: parsed.error.flatten(),
        });
    }
      const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({
            where:{email},
        })
        if(!user){
            return res.status(401).json({
                message:"Invaild Email or Password"
            })
        }
        const isvalid = await bcrypt.compare(password, user.passwordHash)
        
        if(!isvalid){
            return res.status(401).json({
                message:"Invaild Email or Password"
            })
        }
        const token = jwt.sign({
            sub : user.id,
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

