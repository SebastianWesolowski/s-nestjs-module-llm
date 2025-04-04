import { LLMService } from './llm.service';
import { ChatCompletionResponseType, CompletionDto, SpeechToTextDto } from './types';
export declare class LLMController {
    private readonly llmService;
    constructor(llmService: LLMService);
    completion(completionDto: CompletionDto): Promise<ChatCompletionResponseType>;
    speechToText(file: any, speechToTextDto: SpeechToTextDto): Promise<string>;
}
