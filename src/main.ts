import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: ['http://localhost:3000', 'http://vinstagram.ap-northeast-2.elasticbeanstalk.com'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(8080);
}
bootstrap();
