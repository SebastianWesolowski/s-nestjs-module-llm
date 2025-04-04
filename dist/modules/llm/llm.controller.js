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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const llm_service_1 = require("./llm.service");
const types_1 = require("./types");
let LLMController = class LLMController {
    llmService;
    constructor(llmService) {
        this.llmService = llmService;
    }
    async completion(completionDto) {
        const result = await this.llmService.completion(completionDto.messages, completionDto.model, completionDto.stream, completionDto.jsonMode);
        if ('choices' in result) {
            return {
                messages: result.choices.map((choice) => ({
                    role: choice.message.role,
                    content: choice.message.content || '',
                })),
                totalTokens: result.usage?.total_tokens,
                promptTokens: result.usage?.prompt_tokens,
                completionTokens: result.usage?.completion_tokens,
                fullResponse: result,
            };
        }
        return result;
    }
    async speechToText(file, speechToTextDto) {
        return this.llmService.speechToText(file, {
            language: speechToTextDto.language,
            model: speechToTextDto.model,
            responseFormat: speechToTextDto.responseFormat,
        });
    }
};
exports.LLMController = LLMController;
__decorate([
    (0, common_1.Post)('completion'),
    (0, swagger_1.ApiOperation)({ summary: 'Generuje tekst na podstawie wiadomości' }),
    (0, swagger_1.ApiBody)({ type: types_1.CompletionDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.CompletionDto]),
    __metadata("design:returntype", Promise)
], LLMController.prototype, "completion", null);
__decorate([
    (0, common_1.Post)('speech-to-text'),
    (0, swagger_1.ApiOperation)({ summary: 'Konwertuje mowę na tekst' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({ type: types_1.SpeechToTextDto }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, types_1.SpeechToTextDto]),
    __metadata("design:returntype", Promise)
], LLMController.prototype, "speechToText", null);
exports.LLMController = LLMController = __decorate([
    (0, swagger_1.ApiTags)('LLM'),
    (0, common_1.Controller)('llm'),
    __metadata("design:paramtypes", [llm_service_1.LLMService])
], LLMController);
//# sourceMappingURL=llm.controller.js.map