import { Module } from '@nestjs/common';
import { MyService } from './my-service';

@Module({
  providers: [MyService],
  exports: [MyService],
})
export class MyModule {}
