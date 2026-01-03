import z from "zod";

export const createBookingSchema = z.object({
    testId: z.string().min(1),
    collectionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    collectionTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export const getAvailabilityQuerySchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
}).refine((data) => data.date || data.data, {
    message: "Either date or data parameter is required",
});

export const getUserBookingsQuerySchema = z.object({
    page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
    limit: z.string().optional().transform((val) => val ? parseInt(val) : 10),
    status: z.string().optional(),
});

export type CreateBookingDTO = z.infer<typeof createBookingSchema>;
export type GetAvailabilityQueryDTO = z.infer<typeof getAvailabilityQuerySchema>;
export type GetUserBookingsQueryDTO = z.infer<typeof getUserBookingsQuerySchema>;

