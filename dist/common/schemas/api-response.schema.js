"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiResponse = exports.isApiResponse = exports.ApiResponseSchema = void 0;
const zod_1 = require("zod");
exports.ApiResponseSchema = zod_1.z.object({
    message: zod_1.z.string(),
    timestamp: zod_1.z.string().datetime(),
    data: zod_1.z.unknown(),
});
const isApiResponse = (data) => {
    return exports.ApiResponseSchema.safeParse(data).success;
};
exports.isApiResponse = isApiResponse;
const createApiResponse = (data, message = 'Success') => ({
    message,
    timestamp: new Date().toISOString(),
    data,
});
exports.createApiResponse = createApiResponse;
//# sourceMappingURL=api-response.schema.js.map