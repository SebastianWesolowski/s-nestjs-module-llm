import { z } from 'zod';
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<["user", "admin"]>;
    createdAt: z.ZodString;
    updatedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    createdAt: string;
    updatedAt?: string | undefined;
}, {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    createdAt: string;
    updatedAt?: string | undefined;
}>;
export type User = z.infer<typeof UserSchema>;
export default UserSchema;
