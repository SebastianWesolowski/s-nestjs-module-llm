import { Module } from '@nestjs/common';
import { StartController } from './controllers/start.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [],
  controllers: [StartController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
