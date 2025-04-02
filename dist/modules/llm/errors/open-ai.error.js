"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIError = void 0;
class OpenAIError extends Error {
    constructor(message, options) {
        super(message, options);
        this.name = 'OpenAIError';
    }
}
exports.OpenAIError = OpenAIError;
//# sourceMappingURL=open-ai.error.js.map