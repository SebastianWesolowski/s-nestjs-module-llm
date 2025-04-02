"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodValidationFilter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const zod_1 = require("zod");
let ZodValidationFilter = class ZodValidationFilter {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const isDevelopment = this.configService.get('NODE_ENV') === 'development';
        const errorResponse = {
            statusCode: 400,
            message: `Błąd walidacji ${exception._type === 'response' ? 'odpowiedzi' : 'parametrów'}`,
            errors: exception.errors.map((err) => ({
                validation: {
                    type: exception._type || 'unknown',
                    field: err.path[err.path.length - 1] || 'root',
                    fullPath: err.path.length ? err.path.join('.') : 'root',
                    error: err.code,
                },
                details: {
                    message: this.getReadableError(err),
                    code: err.code,
                    path: err.path,
                },
                debug: isDevelopment
                    ? {
                        issue: err,
                        context: err.path.join(' -> ') || 'root',
                    }
                    : undefined,
            })),
            meta: {
                timestamp: new Date().toISOString(),
                type: exception._type === 'response' ? 'odpowiedzi' : 'parametrów',
                total: exception.errors.length,
            },
            ...(isDevelopment && {
                stack: exception.stack,
            }),
        };
        response.status(400).json(errorResponse);
    }
    getReadableError(err) {
        switch (err.code) {
            case 'invalid_type':
                return `Pole ${err.path.join('.')} powinno być typu ${err.expected}, otrzymano ${err.received}`;
            case 'invalid_enum_value':
                return `Niedozwolona wartość dla pola ${err.path.join('.')}`;
            case 'invalid_string':
                return `Nieprawidłowy format tekstu w polu ${err.path.join('.')}`;
            case 'too_small':
                return `Wartość w polu ${err.path.join('.')} jest za mała`;
            case 'too_big':
                return `Wartość w polu ${err.path.join('.')} jest za duża`;
            case 'custom':
                return err.message;
            default:
                return err.message;
        }
    }
};
exports.ZodValidationFilter = ZodValidationFilter;
exports.ZodValidationFilter = ZodValidationFilter = __decorate([
    (0, common_1.Catch)(zod_1.ZodError),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ZodValidationFilter);
//# sourceMappingURL=zod-validation.filter.js.map