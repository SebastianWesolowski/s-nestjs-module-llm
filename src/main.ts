import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3001;

  const config = new DocumentBuilder()
    .setTitle('S-Nest Module LLM')
    .setDescription('API dokumentacja dla S-Nest Module LLM')
    .addTag('s-nestjs-module-llm')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT);

  console.info(`Server is running on http://localhost:${PORT}`);
  console.info(`Docs are running on http://localhost:${PORT}/docs`);
}

void bootstrap();
