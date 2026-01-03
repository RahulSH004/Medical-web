import z from "zod";

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(4),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;

