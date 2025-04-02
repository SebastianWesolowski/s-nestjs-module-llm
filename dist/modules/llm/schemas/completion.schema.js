"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompletionSchema = void 0;
const zod_1 = require("zod");
exports.CompletionSchema = zod_1.z.strictObject({
    userPrompt: zod_1.z.string().min(1),
    systemPrompt: zod_1.z.string().min(1),
    jsonMode: zod_1.z.boolean().optional().default(false),
    includeRaw: zod_1.z.boolean().optional().default(false),
    includeFull: zod_1.z.boolean().optional().default(false),
});
//# sourceMappingURL=completion.schema.js.map