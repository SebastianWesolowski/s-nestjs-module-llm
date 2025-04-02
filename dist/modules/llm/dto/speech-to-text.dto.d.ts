import type { SpeechToTextInput } from '../schemas/speech-to-text.schema';
export declare class SpeechToTextDto implements SpeechToTextInput {
    file: any;
    language?: string;
    model?: string;
    responseFormat: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
    static validate(data: unknown): SpeechToTextInput;
}
