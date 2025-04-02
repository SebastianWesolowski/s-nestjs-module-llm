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
exports.SpeechToTextDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const speech_to_text_schema_1 = require("../schemas/speech-to-text.schema");
class SpeechToTextDto {
    file;
    language;
    model;
    responseFormat;
    static validate(data) {
        return speech_to_text_schema_1.SpeechToTextSchema.parse(data);
    }
}
exports.SpeechToTextDto = SpeechToTextDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string', format: 'binary' }),
    __metadata("design:type", Object)
], SpeechToTextDto.prototype, "file", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], SpeechToTextDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], SpeechToTextDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        enum: ['json', 'text', 'srt', 'verbose_json', 'vtt'],
        default: 'json',
    }),
    __metadata("design:type", String)
], SpeechToTextDto.prototype, "responseFormat", void 0);
//# sourceMappingURL=speech-to-text.dto.js.map