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
const swagger_1 = require("@nestjs/swagger");
const zod_validation_pipe_1 = require("../../../common/pipes/zod-validation.pipe");
const speech_to_text_dto_1 = require("../dto/speech-to-text.dto");
const llm_service_1 = require("../llm.service");
const speech_to_text_schema_1 = require("../schemas/speech-to-text.schema");
let LLMController = class LLMController {
    llmService;
    constructor(llmService) {
        this.llmService = llmService;
    }
    async speechToText(dto) {
        return this.llmService.speechToText(dto.file, {
            language: dto.language,
            model: dto.model,
            responseFormat: dto.responseFormat,
        });
    }
};
exports.LLMController = LLMController;
__decorate([
    (0, common_1.Post)('speech-to-text'),
    (0, swagger_1.ApiOperation)({ summary: 'Konwertuje mowę na tekst' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tekst z audio' }),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(speech_to_text_schema_1.SpeechToTextSchema)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [speech_to_text_dto_1.SpeechToTextDto]),
    __metadata("design:returntype", Promise)
], LLMController.prototype, "speechToText", null);
exports.LLMController = LLMController = __decorate([
    (0, common_1.Controller)('llm'),
    __metadata("design:paramtypes", [llm_service_1.LLMService])
], LLMController);
//# sourceMappingURL=llm.controller.js.map