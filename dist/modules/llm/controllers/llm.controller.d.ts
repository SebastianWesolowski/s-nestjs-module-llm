import { SpeechToTextDto } from '../dto/speech-to-text.dto';
import { LLMService } from '../llm.service';
export declare class LLMController {
    private readonly llmService;
    constructor(llmService: LLMService);
    speechToText(dto: SpeechToTextDto): Promise<string>;
}
