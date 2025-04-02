"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodToOpenAPI = zodToOpenAPI;
exports.ApiZodResponse = ApiZodResponse;
const zod_mock_1 = require("@anatine/zod-mock");
const zod_openapi_1 = require("@anatine/zod-openapi");
const swagger_1 = require("@nestjs/swagger");
function zodToOpenAPI(schema) {
    return (0, zod_openapi_1.generateSchema)(schema);
}
function ApiZodResponse(schema) {
    const mockExample = (0, zod_mock_1.generateMock)(schema);
    return (0, swagger_1.ApiResponse)({
        status: 200,
        content: {
            'application/json': {
                schema: zodToOpenAPI(schema),
                example: mockExample,
            },
        },
        description: 'Successful response',
    });
}
//# sourceMappingURL=zod-swagger.helper.js.map