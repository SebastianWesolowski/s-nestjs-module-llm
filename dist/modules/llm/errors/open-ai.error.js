"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIError = void 0;
class OpenAIError extends Error {
    constructor(message, options) {
        super(message);
        this.name = 'OpenAIError';
        if (options) {
            this.status = options.status;
            this.cause = options.cause;
        }
    }
    status;
    cause;
}
exports.OpenAIError = OpenAIError;
//# sourceMappingURL=open-ai.error.js.map