"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodValidate = void 0;
const common_1 = require("@nestjs/common");
const zod_validation_filter_1 = require("../filters/zod-validation.filter");
const ZodValidate = (paramSchema, responseSchema) => {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            if (paramSchema && args.length > 0) {
                const paramResult = paramSchema.safeParse(args[0]);
                if (!paramResult.success) {
                    throw Object.assign(paramResult.error, { _type: 'params' });
                }
                args[0] = paramResult.data;
            }
            const result = await originalMethod.apply(this, args);
            if (responseSchema) {
                const responseResult = responseSchema.safeParse(result);
                if (!responseResult.success) {
                    throw Object.assign(responseResult.error, { _type: 'response' });
                }
                return responseResult.data;
            }
            return result;
        };
        (0, common_1.UseFilters)(zod_validation_filter_1.ZodValidationFilter)(target, propertyKey, descriptor);
        return descriptor;
    };
};
exports.ZodValidate = ZodValidate;
//# sourceMappingURL=zod-validate.decorator.js.map