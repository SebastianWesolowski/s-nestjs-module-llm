"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const api_response_schema_1 = require("../schemas/api-response.schema");
let ApiResponseInterceptor = class ApiResponseInterceptor {
    intercept(_, next) {
        return next.handle().pipe((0, operators_1.map)((data) => {
            if ((0, api_response_schema_1.isApiResponse)(data)) {
                return data;
            }
            if ('error' in data) {
                return (0, api_response_schema_1.createApiResponse)(data, 'Error');
            }
            return (0, api_response_schema_1.createApiResponse)(data);
        }));
    }
};
exports.ApiResponseInterceptor = ApiResponseInterceptor;
exports.ApiResponseInterceptor = ApiResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], ApiResponseInterceptor);
//# sourceMappingURL=api-response.interceptor.js.map