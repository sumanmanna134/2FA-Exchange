import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = +process.env.APP_PORT || 3000;
  console.log('Port running on : ', port);
  const options = new DocumentBuilder()
    .setTitle('2FA-Exchange API')
    .setDescription('Exchange API Documentation')
    .setVersion('2024 v1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
  await app.listen(port);
}
bootstrap();
