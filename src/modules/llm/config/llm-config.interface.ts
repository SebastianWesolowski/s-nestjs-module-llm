import { DynamicModule, InjectionToken, OptionalFactoryDependency, Type } from '@nestjs/common';

export interface LLMModuleOptions {
  apiKey?: string;
  logPrompts?: boolean;
  logPath?: string;
  defaultModel?: string;
  defaultWhisperModel?: string;
}

export interface LLMModuleAsyncOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory: (...args: any[]) => Promise<LLMModuleOptions> | LLMModuleOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imports?: (Type<any> | DynamicModule | Promise<DynamicModule>)[];
}
