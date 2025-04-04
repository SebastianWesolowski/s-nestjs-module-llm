import { z } from 'zod';
export declare const ValidationErrorSchema: z.ZodObject<{
    statusCode: z.ZodNumber;
    message: z.ZodString;
    errors: z.ZodArray<z.ZodObject<{
        validation: z.ZodObject<{
            type: z.ZodEnum<["params", "response", "unknown"]>;
            field: z.ZodString;
            fullPath: z.ZodString;
            error: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "params" | "unknown" | "response";
            error: string;
            field: string;
            fullPath: string;
        }, {
            type: "params" | "unknown" | "response";
            error: string;
            field: string;
            fullPath: string;
        }>;
        details: z.ZodObject<{
            message: z.ZodString;
            code: z.ZodString;
            path: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            code: string;
            path: string[];
            message: string;
        }, {
            code: string;
            path: string[];
            message: string;
        }>;
        debug: z.ZodOptional<z.ZodObject<{
            issue: z.ZodAny;
            context: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            context: string;
            issue?: any;
        }, {
            context: string;
            issue?: any;
        }>>;
    }, "strip", z.ZodTypeAny, {
        validation: {
            type: "params" | "unknown" | "response";
            error: string;
            field: string;
            fullPath: string;
        };
        details: {
            code: string;
            path: string[];
            message: string;
        };
        debug?: {
            context: string;
            issue?: any;
        } | undefined;
    }, {
        validation: {
            type: "params" | "unknown" | "response";
            error: string;
            field: string;
            fullPath: string;
        };
        details: {
            code: string;
            path: string[];
            message: string;
        };
        debug?: {
            context: string;
            issue?: any;
        } | undefined;
    }>, "many">;
    meta: z.ZodObject<{
        timestamp: z.ZodString;
        type: z.ZodString;
        total: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: string;
        timestamp: string;
        total: number;
    }, {
        type: string;
        timestamp: string;
        total: number;
    }>;
    stack: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    errors: {
        validation: {
            type: "params" | "unknown" | "response";
            error: string;
            field: string;
            fullPath: string;
        };
        details: {
            code: string;
            path: string[];
            message: string;
        };
        debug?: {
            context: string;
            issue?: any;
        } | undefined;
    }[];
    statusCode: number;
    meta: {
        type: string;
        timestamp: string;
        total: number;
    };
    stack?: string | undefined;
}, {
    message: string;
    errors: {
        validation: {
            type: "params" | "unknown" | "response";
            error: string;
            field: string;
            fullPath: string;
        };
        details: {
            code: string;
            path: string[];
            message: string;
        };
        debug?: {
            context: string;
            issue?: any;
        } | undefined;
    }[];
    statusCode: number;
    meta: {
        type: string;
        timestamp: string;
        total: number;
    };
    stack?: string | undefined;
}>;
