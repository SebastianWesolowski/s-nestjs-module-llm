"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeechToTextDto = exports.SpeechToTextSchema = exports.ResponseFormatSchema = exports.ChatCompletionResponseDto = exports.ChatCompletionResponseSchema = exports.ChatCompletionResponseMessageSchema = exports.CompletionDto = exports.CompletionSchema = exports.MessageDto = exports.MessageSchema = exports.AsyncLLMConfigSchema = exports.LLMConfigSchema = void 0;
const zod_nestjs_1 = require("@anatine/zod-nestjs");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
exports.LLMConfigSchema = zod_1.z.strictObject({
    apiKey: zod_1.z.string(),
    logPrompts: zod_1.z.boolean().optional().default(false),
    logPath: zod_1.z.string().optional(),
    defaultModel: zod_1.z.string().optional(),
    defaultWhisperModel: zod_1.z.string().optional(),
});
exports.AsyncLLMConfigSchema = zod_1.z.strictObject({
    useFactory: zod_1.z
        .function()
        .args(zod_1.z.any())
        .returns(zod_1.z.union([zod_1.z.promise(exports.LLMConfigSchema), exports.LLMConfigSchema])),
    inject: zod_1.z.array(zod_1.z.custom()).optional(),
    imports: zod_1.z.array(zod_1.z.union([zod_1.z.custom(), zod_1.z.custom()])).optional(),
});
exports.MessageSchema = zod_1.z.strictObject({
    role: zod_1.z.enum(['system', 'user', 'assistant']),
    content: zod_1.z.string().min(1),
});
class MessageDto extends (0, zod_nestjs_1.createZodDto)(exports.MessageSchema) {
}
exports.MessageDto = MessageDto;
exports.CompletionSchema = zod_1.z.strictObject({
    messages: zod_1.z.array(exports.MessageSchema).min(1),
    model: zod_1.z.string().min(1).optional(),
    stream: zod_1.z.boolean().optional(),
    jsonMode: zod_1.z.boolean().optional(),
});
class CompletionDto extends (0, zod_nestjs_1.createZodDto)(exports.CompletionSchema) {
}
exports.CompletionDto = CompletionDto;
exports.ChatCompletionResponseMessageSchema = zod_1.z.strictObject({
    role: zod_1.z.string(),
    content: zod_1.z.string(),
});
exports.ChatCompletionResponseSchema = zod_1.z.strictObject({
    messages: zod_1.z.array(exports.ChatCompletionResponseMessageSchema).optional(),
    totalTokens: zod_1.z.number().optional(),
    promptTokens: zod_1.z.number().optional(),
    completionTokens: zod_1.z.number().optional(),
    parsedContent: zod_1.z.unknown().optional(),
    rawContent: zod_1.z.string().optional(),
    fullResponse: zod_1.z.unknown().optional(),
});
class ChatCompletionResponseDto extends (0, zod_nestjs_1.createZodDto)(exports.ChatCompletionResponseSchema) {
}
exports.ChatCompletionResponseDto = ChatCompletionResponseDto;
exports.ResponseFormatSchema = zod_1.z.enum(['json', 'text', 'srt', 'verbose_json', 'vtt']);
exports.SpeechToTextSchema = zod_1.z.strictObject({
    file: zod_1.z.any(),
    language: zod_1.z.string().min(1).optional(),
    model: zod_1.z.string().min(1).optional(),
    responseFormat: exports.ResponseFormatSchema.optional(),
});
class SpeechToTextDto {
    audio;
    language;
    model;
    prompt;
    responseFormat;
    temperature;
}
exports.SpeechToTextDto = SpeechToTextDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Plik audio do transkrypcji w formacie base64',
        example: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10...',
    }),
    __metadata("design:type", String)
], SpeechToTextDto.prototype, "audio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Język audio (opcjonalny)',
        required: false,
        example: 'pl',
    }),
    __metadata("design:type", String)
], SpeechToTextDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Model Whisper do użycia (opcjonalny)',
        required: false,
        example: 'whisper-1',
    }),
    __metadata("design:type", String)
], SpeechToTextDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prompt do pomocy w transkrypcji (opcjonalny)',
        required: false,
        example: 'Transkrypcja rozmowy o programowaniu',
    }),
    __metadata("design:type", String)
], SpeechToTextDto.prototype, "prompt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Format odpowiedzi (opcjonalny)',
        required: false,
        enum: ['json', 'text', 'srt', 'verbose_json', 'vtt'],
        default: 'json',
    }),
    __metadata("design:type", String)
], SpeechToTextDto.prototype, "responseFormat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Temperatura próbkowania (opcjonalna)',
        required: false,
        example: 0.7,
    }),
    __metadata("design:type", String)
], SpeechToTextDto.prototype, "temperature", void 0);
//# sourceMappingURL=index.js.map