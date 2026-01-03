import z from "zod";

export const getTestsQuerySchema = z.object({
    page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
    limit: z.string().optional().transform((val) => val ? parseInt(val) : 12),
});

export type GetTestsQueryDTO = z.infer<typeof getTestsQuerySchema>;

