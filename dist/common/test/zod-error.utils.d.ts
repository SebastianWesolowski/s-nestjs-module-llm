export interface ValidationError {
    validation: {
        type: string;
        field: string;
        fullPath: string;
        error: string;
    };
    details: {
        message: string;
        code: string;
        path: string[];
    };
    debug: {
        issue: {
            code: string;
            expected: string;
            received: string;
            path: string[];
            message: string;
        };
        context: string;
    };
}
export interface ValidationErrorResponse {
    statusCode: number;
    message: string;
    errors: ValidationError[];
    meta: {
        timestamp: string;
        type: string;
        total: number;
    };
    stack: string;
}
export declare const expectZodError: (response: {
    body: ValidationErrorResponse;
}) => ValidationError[];
export declare const expectFieldError: (errors: ValidationError[], field: string) => ValidationError | undefined;
export declare const expectRequiredFieldError: (errors: ValidationError[], field: string) => ValidationError | undefined;
export declare const expectMinValueError: (errors: ValidationError[], field: string) => ValidationError | undefined;
export declare const expectMaxValueError: (errors: ValidationError[], field: string) => ValidationError | undefined;
