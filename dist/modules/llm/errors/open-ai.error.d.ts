export declare class OpenAIError extends Error {
    constructor(message: string, options?: {
        status?: number;
        cause?: unknown;
    });
    status?: number;
    cause?: unknown;
}
