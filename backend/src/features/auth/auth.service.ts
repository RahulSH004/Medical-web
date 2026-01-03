import { prisma } from "../../config/database";
import bcrypt from "bcrypt";
import { signToken } from "../../utils/jwt.util";
import { RegisterDTO, LoginDTO } from "./auth.validation";
import { ConflictError, UnauthorizedError } from "../../utils/error.util";
import { SALT_ROUND } from "../../utils/constants";

export class AuthService {
    static async register(data: RegisterDTO) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new ConflictError("Email already registered");
        }

        const hashPassword = await bcrypt.hash(data.password, SALT_ROUND);
        
        await prisma.user.create({
            data: {
                email: data.email,
                passwordHash: hashPassword,
                name: data.name,
                role: "USER"
            },
        });

        return { message: "User registered successfully" };
    }

    static async login(data: LoginDTO) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            throw new UnauthorizedError("Invalid Email or Password");
        }

        const isValid = await bcrypt.compare(data.password, user.passwordHash);

        if (!isValid) {
            throw new UnauthorizedError("Invalid Email or Password");
        }

        const token = signToken({
            sub: user.id,
            role: user.role
        });

        return {
            message: "Login successfully",
            token
        };
    }
}

