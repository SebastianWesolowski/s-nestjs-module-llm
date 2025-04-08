/**
 * Konfiguracja aplikacji z walidacją zmiennych środowiskowych.
 * Wykorzystuje bibliotekę Zod do walidacji i parsowania konfiguracji.
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

/**
 * Schemat walidacji zmiennych środowiskowych.
 * Definiuje wymagane zmienne i ich typy.
 */
const EnvSchema = z.object({
  /**
   * Środowisko uruchomieniowe aplikacji.
   * Możliwe wartości: development, production, test
   * Domyślnie: development
   */
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  /**
   * Port na którym uruchomiona zostanie aplikacja.
   * Musi być liczbą dodatnią.
   * Domyślnie: 3000
   */
  PORT: z.preprocess((a) => parseInt(String(a), 10), z.number().positive()).default(3000),
});

/**
 * Moduł konfiguracyjny z walidacją zmiennych środowiskowych.
 * Używa ConfigModule z NestJS i schematu Zod do walidacji.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      /**
       * Funkcja walidująca konfigurację.
       * Sprawdza czy wszystkie zmienne środowiskowe są zgodne ze schematem.
       * W przypadku błędu, wyświetla szczegóły i rzuca wyjątek.
       */
      validate: (config) => {
        const result = EnvSchema.safeParse(config);
        if (!result.success) {
          console.error('❌ Nieprawidłowa konfiguracja środowiska:', result.error.format());
          throw new Error('Nieprawidłowa konfiguracja środowiska');
        }
        return result.data;
      },
      isGlobal: true,
    }),
  ],
})
export class ZodConfigModule {}
