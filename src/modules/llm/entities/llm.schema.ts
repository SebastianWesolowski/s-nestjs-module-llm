// Schema Zod dla użytkownika
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(50),
  email: z.string().email(),
  role: z.enum(['user', 'admin']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export type User = z.infer<typeof UserSchema>;

export default UserSchema;
