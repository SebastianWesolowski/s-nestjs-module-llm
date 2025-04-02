import { z } from 'zod';
export declare const ApiResponseSchema: z.ZodObject<{
    message: z.ZodString;
    timestamp: z.ZodString;
    data: z.ZodUnknown;
}, "strip", z.ZodTypeAny, {
    message: string;
    timestamp: string;
    data?: unknown;
}, {
    message: string;
    timestamp: string;
    data?: unknown;
}>;
export type ApiResponse<T = unknown> = {
    message: string;
    timestamp: string;
    data: T;
};
export declare const isApiResponse: (data: unknown) => data is ApiResponse;
export declare const createApiResponse: <T>(data: T, message?: string) => ApiResponse<T>;
