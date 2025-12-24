import "dotenv/config"
import z from "zod";


const envSchema = z.object({
    PORT: z.coerce.number().default(4000),
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url(),
})
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error(parsedEnv.error.format());
    process.exit(1);
}
export const env = parsedEnv.data;