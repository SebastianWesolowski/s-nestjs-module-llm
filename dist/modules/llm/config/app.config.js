"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodConfigModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const zod_1 = require("zod");
const EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(['development', 'production', 'test'])
        .default('development'),
    PORT: zod_1.z
        .preprocess((a) => parseInt(String(a), 10), zod_1.z.number().positive())
        .default(3000),
});
let ZodConfigModule = class ZodConfigModule {
};
exports.ZodConfigModule = ZodConfigModule;
exports.ZodConfigModule = ZodConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                validate: (config) => {
                    const result = EnvSchema.safeParse(config);
                    if (!result.success) {
                        console.error('❌ Nieprawidłowa konfiguracja środowiska:', result.error.format());
                        throw new Error('Nieprawidłowa konfiguracja środowiska');
                    }
                    return result.data;
                },
                isGlobal: true,
            }),
        ],
    })
], ZodConfigModule);
//# sourceMappingURL=app.config.js.map