import { DynamicModule } from '@nestjs/common';
import { LLMModuleAsyncOptions, LLMModuleOptions } from './config/llm-config.interface';
export declare class LLMModule {
    static forRoot(options?: LLMModuleOptions): DynamicModule;
    static forRootAsync(options: LLMModuleAsyncOptions): DynamicModule;
}
