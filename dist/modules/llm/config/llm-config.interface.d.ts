export interface LLMModuleOptions {
    apiKey?: string;
    logPrompts?: boolean;
    logPath?: string;
    defaultModel?: string;
    defaultWhisperModel?: string;
}
export interface LLMModuleAsyncOptions {
    useFactory: (...args: any[]) => Promise<LLMModuleOptions> | LLMModuleOptions;
    inject?: any[];
    imports?: any[];
}
