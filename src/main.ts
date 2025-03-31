import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MyModule } from '@/my-module.module';

async function bootstrap() {
  const app = await NestFactory.create(MyModule);

  const config = new DocumentBuilder()
    .setTitle('S-Nest Module LLM')
    .setDescription('API dokumentacja dla S-Nest Module LLM')
    .setVersion('1.0')
    .addTag('s-nestjs-module-llm')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3001);
}

void bootstrap();
