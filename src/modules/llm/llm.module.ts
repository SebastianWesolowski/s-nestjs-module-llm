import { DynamicModule, Module } from '@nestjs/common';
import { ZodConfigModule } from './config/app.config';
import { LLMModuleAsyncOptions, LLMModuleOptions } from './config/llm-config.interface';
import { LLM_MODULE_OPTIONS } from './config/llm.constants';
import { LLMController } from './controllers/llm.controller';
import { LLMService } from './llm.service';

@Module({
  imports: [ZodConfigModule],
  controllers: [LLMController],
  providers: [
    {
      provide: LLM_MODULE_OPTIONS,
      useValue: {},
    },
    LLMService,
  ],
  exports: [LLMService],
})
export class LLMModule {
  static forRoot(options?: LLMModuleOptions): DynamicModule {
    return {
      module: LLMModule,
      imports: [ZodConfigModule],
      providers: [
        {
          provide: LLM_MODULE_OPTIONS,
          useValue: options || {},
        },
        LLMService,
      ],
      exports: [LLMService],
    };
  }

  static forRootAsync(options: LLMModuleAsyncOptions): DynamicModule {
    return {
      module: LLMModule,
      imports: [...(options.imports || []), ZodConfigModule],
      providers: [
        {
          provide: LLM_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        LLMService,
      ],
      exports: [LLMService],
    };
  }
}
