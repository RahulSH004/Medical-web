import z from "zod";

export const createReportSchema = z.object({
    bookingId: z.string().min(1),
    fileUrl: z.string().url(),
    remarks: z.string()
});

export type CreateReportDTO = z.infer<typeof createReportSchema>;

