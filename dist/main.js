"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const PORT = process.env.PORT || 3001;
    const config = new swagger_1.DocumentBuilder()
        .setTitle('S-Nest Module LLM')
        .setDescription('API dokumentacja dla S-Nest Module LLM')
        .addTag('s-nestjs-module-llm')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.listen(PORT);
    console.info(`Server is running on http://localhost:${PORT}`);
    console.info(`Docs are running on http://localhost:${PORT}/docs`);
}
void bootstrap();
//# sourceMappingURL=main.js.map