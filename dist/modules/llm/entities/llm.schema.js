"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const zod_1 = require("zod");
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(2).max(50),
    email: zod_1.z.string().email(),
    role: zod_1.z.enum(['user', 'admin']),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime().optional(),
});
exports.default = exports.UserSchema;
//# sourceMappingURL=llm.schema.js.map