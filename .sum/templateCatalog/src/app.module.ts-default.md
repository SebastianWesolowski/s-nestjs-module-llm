import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ZodValidationFilter } from './common/filters/zod-validation.filter';
import { ZodConfigModule } from './config/app.config';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [ZodConfigModule, UsersModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ZodValidationFilter,
    },
  ],
})
export class AppModule {}
