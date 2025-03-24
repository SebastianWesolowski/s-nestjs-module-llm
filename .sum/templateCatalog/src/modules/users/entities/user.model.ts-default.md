// Model danych użytkownika
import { z } from 'zod';
import { UserSchema } from './user.schema';

export type User = z.infer<typeof UserSchema>;

export const mockUsers: User[] = [
  {
    id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    name: 'Jan Kowalski',
    email: 'jan.kowalski@example.com',
    role: 'admin',
    createdAt: '2023-01-10T10:00:00.000Z',
  },
  {
    id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
    name: 'Anna Nowak',
    email: 'anna.nowak@example.com',
    role: 'user',
    createdAt: '2023-02-15T14:30:00.000Z',
    updatedAt: '2023-03-20T09:15:00.000Z',
  },
];
