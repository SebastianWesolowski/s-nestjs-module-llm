"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMConfigSchema = void 0;
const zod_1 = require("zod");
const llm_constants_1 = require("./llm.constants");
exports.LLMConfigSchema = zod_1.z.object({
    apiKey: zod_1.z.string().optional(),
    logPrompts: zod_1.z.boolean().optional().default(false),
    logPath: zod_1.z.string().optional(),
    defaultModel: zod_1.z.string().optional().default(llm_constants_1.DEFAULT_MODEL),
    defaultWhisperModel: zod_1.z.string().optional().default(llm_constants_1.DEFAULT_WHISPER_MODEL),
});
//# sourceMappingURL=llm-config.schema.js.map