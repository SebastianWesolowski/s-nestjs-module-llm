import { DynamicModule, InjectionToken, OptionalFactoryDependency, Type } from '@nestjs/common';
export interface LLMModuleOptions {
    apiKey?: string;
    logPrompts?: boolean;
    logPath?: string;
    defaultModel?: string;
    defaultWhisperModel?: string;
}
export interface LLMModuleAsyncOptions {
    useFactory: (...args: any[]) => Promise<LLMModuleOptions> | LLMModuleOptions;
    inject?: (InjectionToken | OptionalFactoryDependency)[];
    imports?: (Type<any> | DynamicModule | Promise<DynamicModule>)[];
}
