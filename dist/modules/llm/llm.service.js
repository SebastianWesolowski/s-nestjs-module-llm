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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = __importDefault(require("openai"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const llm_constants_1 = require("./config/llm.constants");
const open_ai_error_1 = require("./errors/open-ai.error");
let LLMService = class LLMService {
    openai;
    config;
    logPath;
    constructor(options) {
        const defaultConfig = {
            apiKey: process.env.OPENAI_API_KEY ?? '',
            logPrompts: false,
            logPath: path_1.default.join(__dirname, 'prompts.md'),
            defaultModel: llm_constants_1.DEFAULT_MODEL,
            defaultWhisperModel: llm_constants_1.DEFAULT_WHISPER_MODEL,
        };
        this.config = { ...defaultConfig, ...options };
        this.openai = new openai_1.default({ apiKey: this.config.apiKey });
        this.logPath = this.config.logPath || path_1.default.join(__dirname, 'prompts.md');
    }
    async completion(messages, model = this.config.defaultModel, stream = false, jsonMode = false) {
        try {
            const chatCompletion = await this.openai.chat.completions.create({
                messages,
                model,
                stream,
                response_format: jsonMode ? { type: 'json_object' } : { type: 'text' },
            });
            void this.logCompletion(messages, chatCompletion);
            return chatCompletion;
        }
        catch (error) {
            throw new open_ai_error_1.OpenAIError('Nie udało się wygenerować odpowiedzi', { cause: error });
        }
    }
    async speechToText(audio, options = {}) {
        const { language = 'en', model = this.config.defaultWhisperModel, responseFormat = 'json' } = options;
        try {
            const response = await this.openai.audio.transcriptions.create({
                file: audio,
                model,
                language,
                response_format: responseFormat,
            });
            return response.text;
        }
        catch (error) {
            throw new open_ai_error_1.OpenAIError('Nie udało się transkrybować audio', { cause: error });
        }
    }
    async createCompletion({ userPrompt, systemPrompt, jsonMode = false, includeRaw = false, includeFull = false, }) {
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                response_format: jsonMode ? { type: 'json_object' } : { type: 'text' },
            });
            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new open_ai_error_1.OpenAIError('Nie otrzymano treści od OpenAI');
            }
            const result = {};
            if (jsonMode) {
                try {
                    result.parsedContent = JSON.parse(content);
                }
                catch (parseError) {
                    throw new open_ai_error_1.OpenAIError('Nie udało się sparsować odpowiedzi OpenAI jako JSON', { cause: parseError });
                }
            }
            if (includeRaw) {
                result.rawContent = content;
            }
            if (includeFull) {
                result.fullResponse = response;
            }
            if (!jsonMode) {
                result.parsedContent = content;
            }
            return result;
        }
        catch (error) {
            if (error instanceof open_ai_error_1.OpenAIError) {
                throw error;
            }
            throw new open_ai_error_1.OpenAIError('Nie udało się utworzyć kompletacji', { cause: error });
        }
    }
    async logCompletion(messages, completion) {
        if (!this.config.logPrompts)
            return;
        try {
            const logContent = `Messages:\n${JSON.stringify(messages, null, 2)}\n\n` +
                `Chat Completion:\n${JSON.stringify(completion, null, 2)}\n\n`;
            await fs_1.promises.appendFile(this.logPath, logContent);
        }
        catch (error) {
            throw new open_ai_error_1.OpenAIError('Nie udało się zalogować kompletacji', { cause: error });
        }
    }
    async getPictureDescription(pictures, systemPrompt) {
        try {
            const imageMessages = pictures.map((pic) => ({
                type: 'image_url',
                image_url: {
                    url: `data:image/jpeg;base64,${pic.toString('base64')}`,
                },
            }));
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4-vision-preview',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt,
                    },
                    {
                        role: 'user',
                        content: imageMessages,
                    },
                ],
                max_tokens: 1000,
            });
            const content = response.choices[0] ? response.choices[0]?.message?.content : 'Nie otrzymano treści od OpenAI';
            if (!content) {
                throw new open_ai_error_1.OpenAIError('Nie otrzymano treści od OpenAI');
            }
            return {
                parsedContent: content,
                rawContent: content,
                fullResponse: response,
            };
        }
        catch (error) {
            throw new open_ai_error_1.OpenAIError('Nie udało się uzyskać opisu obrazu', { cause: error });
        }
    }
};
exports.LLMService = LLMService;
exports.LLMService = LLMService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(llm_constants_1.LLM_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], LLMService);
//# sourceMappingURL=llm.service.js.map