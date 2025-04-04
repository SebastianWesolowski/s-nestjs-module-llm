import { DynamicModule } from '@nestjs/common';
import { AsyncLLMConfigType, LLMConfigType } from './types';
export declare class LLMModule {
    static forRoot(options: LLMConfigType): DynamicModule;
    static forRootAsync(options: AsyncLLMConfigType): DynamicModule;
}
