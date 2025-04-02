"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationErrorSchema = void 0;
const zod_1 = require("zod");
exports.ValidationErrorSchema = zod_1.z.object({
    statusCode: zod_1.z.number(),
    message: zod_1.z.string(),
    errors: zod_1.z.array(zod_1.z.object({
        validation: zod_1.z.object({
            type: zod_1.z.enum(['params', 'response', 'unknown']),
            field: zod_1.z.string(),
            fullPath: zod_1.z.string(),
            error: zod_1.z.string(),
        }),
        details: zod_1.z.object({
            message: zod_1.z.string(),
            code: zod_1.z.string(),
            path: zod_1.z.array(zod_1.z.string()),
        }),
        debug: zod_1.z
            .object({
            issue: zod_1.z.any(),
            context: zod_1.z.string(),
        })
            .optional(),
    })),
    meta: zod_1.z.object({
        timestamp: zod_1.z.string(),
        type: zod_1.z.string(),
        total: zod_1.z.number(),
    }),
    stack: zod_1.z.string().optional(),
});
//# sourceMappingURL=validation-error.schema.js.map