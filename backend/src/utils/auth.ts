import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import {prisma} from "../config/database"



export const auth  = betterAuth({
        database: prismaAdapter(prisma,{
        provider: "postgresql",
    }),

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    session: {
        expiresIn: 60*60*24*7,
        updateAge: 60*60*24,
        cookieCache: {
            enabled: true,
            maxAge: 5*60,
        },
    },
    user: {
        additionalFields:{
            role:{
                type: "string",
                defaultValue: "USER",
                required: false,
            },
        },
    },
    advanced:{
        useSecureCookies: process.env.NODE_ENV === "production",
        cookieDomain: process.env.COOKIE_DOMAIN,
    },
      // Base URL
    baseURL: process.env.BASE_URL || "http://localhost:4000",
  
    // Secret for encryption
    secret: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET,

});

export type Session = typeof auth.$Infer.Session;
export type user = typeof auth.$Infer.Session.user;