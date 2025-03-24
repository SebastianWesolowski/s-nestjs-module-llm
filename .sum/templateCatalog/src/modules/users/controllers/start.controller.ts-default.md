// Kontroler z endpointem startowym
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { ZodValidate } from '@common/decorators/zod-validate.decorator';
import { ApiZodResponse } from '@common/utils/zod-swagger.helper';
import { UserSchema } from '@modules/users/entities/user.schema';
import { UserService } from '@modules/users/services/user.service';

const StartDataSchema = z.object({
  users: z.array(UserSchema),
  usersCount: z.number().int().min(0),
});

@ApiTags('Start')
@Controller('api')
export class StartController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Sprawdź status API' })
  @ApiResponse({ status: 200, description: 'API działa poprawnie' })
  getApiRoot() {
    return { message: 'API działa poprawnie' };
  }

  @Get('start')
  @ApiOperation({ summary: 'Pobierz dane startowe' })
  @ApiZodResponse(StartDataSchema)
  @ApiResponse({ status: 400, description: 'Błąd walidacji' })
  @ZodValidate(StartDataSchema)
  getStartData() {
    const users = this.userService.getUsers();
    return {
      users,
      usersCount: users.length,
    };
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Pobierz użytkownika po ID' })
  @ApiZodResponse(UserSchema)
  @ApiResponse({ status: 400, description: 'Błąd walidacji' })
  @ApiResponse({ status: 404, description: 'Nie znaleziono użytkownika' })
  @ZodValidate(UserSchema)
  getUserById(@Param('id') id: string) {
    const user = this.userService.getUserById(id);
    if (!user) {
      throw new Error('Nie znaleziono użytkownika');
    }
    return user;
  }
}
