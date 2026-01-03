import { Response } from "express";

export const respondSuccess = (
    res: Response,
    statusCode: number,
    message: string,
    data: any = null
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        ...(data && { data }),
    });
};

export const respondError = (
    res: Response,
    statusCode: number,
    message: string,
    errors: any = null
) => {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors }),
    });
};

