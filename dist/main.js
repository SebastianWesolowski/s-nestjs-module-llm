"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const my_module_module_1 = require("@/my-module.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(my_module_module_1.MyModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('S-Nest Module LLM')
        .setDescription('API dokumentacja dla S-Nest Module LLM')
        .setVersion('1.0')
        .addTag('s-nestjs-module-llm')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.listen(3001);
}
void bootstrap();
//# sourceMappingURL=main.js.map