"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompletionDto = void 0;
const zod_nestjs_1 = require("@anatine/zod-nestjs");
const completion_schema_1 = require("../schemas/completion.schema");
class CompletionDto extends (0, zod_nestjs_1.createZodDto)(completion_schema_1.CompletionSchema) {
}
exports.CompletionDto = CompletionDto;
//# sourceMappingURL=completion.dto.js.map