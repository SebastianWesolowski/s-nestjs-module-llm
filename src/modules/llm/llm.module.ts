/**
 * Główny moduł NestJS dla modułu LLM.
 * Zapewnia konfigurację i eksportuje komponenty modułu.
 */
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LLM_MODULE_OPTIONS } from './config/llm.constants';
import { LLMController } from './llm.controller';
import { LLMService } from './llm.service';
import { AsyncLLMConfigType, LLMConfigType } from './types';

/**
 * Główny moduł NestJS dla modułu LLM.
 * Zapewnia konfigurację i eksportuje komponenty modułu.
 */
@Module({
  imports: [ConfigModule],
})
export class LLMModule {
  /**
   * Statyczna konfiguracja modułu.
   *
   * @param options - Opcje konfiguracyjne modułu
   * @returns DynamicModule skonfigurowany z podanymi opcjami
   */
  static forRoot(options: LLMConfigType): DynamicModule {
    return {
      module: LLMModule,
      controllers: [LLMController],
      providers: [
        {
          provide: LLM_MODULE_OPTIONS,
          useValue: options,
        },
        LLMService,
      ],
      exports: [LLMService],
    };
  }

  /**
   * Asynchroniczna konfiguracja modułu.
   *
   * @param options - Asynchroniczne opcje konfiguracyjne modułu
   * @returns DynamicModule skonfigurowany z podanymi opcjami
   */
  static forRootAsync(options: AsyncLLMConfigType): DynamicModule {
    return {
      module: LLMModule,
      imports: options.imports || [],
      controllers: [LLMController],
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
