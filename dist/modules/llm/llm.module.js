"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LLMModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMModule = void 0;
const common_1 = require("@nestjs/common");
const app_config_1 = require("./config/app.config");
const llm_constants_1 = require("./config/llm.constants");
const llm_controller_1 = require("./controllers/llm.controller");
const llm_service_1 = require("./llm.service");
let LLMModule = LLMModule_1 = class LLMModule {
    static forRoot(options) {
        return {
            module: LLMModule_1,
            imports: [app_config_1.ZodConfigModule],
            providers: [
                {
                    provide: llm_constants_1.LLM_MODULE_OPTIONS,
                    useValue: options || {},
                },
                llm_service_1.LLMService,
            ],
            exports: [llm_service_1.LLMService],
        };
    }
    static forRootAsync(options) {
        return {
            module: LLMModule_1,
            imports: [...(options.imports || []), app_config_1.ZodConfigModule],
            providers: [
                {
                    provide: llm_constants_1.LLM_MODULE_OPTIONS,
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                },
                llm_service_1.LLMService,
            ],
            exports: [llm_service_1.LLMService],
        };
    }
};
exports.LLMModule = LLMModule;
exports.LLMModule = LLMModule = LLMModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [app_config_1.ZodConfigModule],
        controllers: [llm_controller_1.LLMController],
        providers: [
            {
                provide: llm_constants_1.LLM_MODULE_OPTIONS,
                useValue: {},
            },
            llm_service_1.LLMService,
        ],
        exports: [llm_service_1.LLMService],
    })
], LLMModule);
//# sourceMappingURL=llm.module.js.map