import { z } from 'zod';
import { UserSchema } from './llm.schema';
export type User = z.infer<typeof UserSchema>;
export declare const mockUsers: User[];
