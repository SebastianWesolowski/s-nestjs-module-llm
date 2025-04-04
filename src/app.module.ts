import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LLMModule } from './modules/llm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LLMModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get('OPENAI_API_KEY') || '',
        logPrompts: configService.get('LOG_PROMPTS') === 'true',
        logPath: configService.get('LOG_PATH'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
