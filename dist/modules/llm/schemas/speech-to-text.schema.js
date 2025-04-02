"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeechToTextSchema = void 0;
const zod_1 = require("zod");
exports.SpeechToTextSchema = zod_1.z.object({
    file: zod_1.z.any(),
    language: zod_1.z.string().optional(),
    model: zod_1.z.string().optional(),
    responseFormat: zod_1.z.enum(['json', 'text', 'srt', 'verbose_json', 'vtt']).optional().default('json'),
});
//# sourceMappingURL=speech-to-text.schema.js.map