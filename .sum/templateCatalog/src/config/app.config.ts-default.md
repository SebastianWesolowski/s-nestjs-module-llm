// Konfiguracja Zod dla NestJS
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .preprocess((a) => parseInt(String(a), 10), z.number().positive())
    .default(3000),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (config) => {
        const result = EnvSchema.safeParse(config);
        if (!result.success) {
          console.error(
            '❌ Nieprawidłowa konfiguracja środowiska:',
            result.error.format(),
          );
          throw new Error('Nieprawidłowa konfiguracja środowiska');
        }
        return result.data;
      },
      isGlobal: true,
    }),
  ],
})
export class ZodConfigModule {}
