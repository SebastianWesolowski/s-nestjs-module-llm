// Serwis do obsługi danych użytkowników
import { Injectable } from '@nestjs/common';
import { mockUsers, User } from '@modules/users/entities/user.model';

@Injectable()
export class UserService {
  private users: User[] = [...mockUsers];

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }
}
