import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { AcessTokenGuard } from './auth/guards';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // const config = new DocumentBuilder()
  //   .setTitle('Cats example')
  //   .setDescription('The cats API description')
  //   .setVersion('1.0')
  //   .addTag('cats')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);
  app.use(helmet());
  await app.listen(5000);
}
bootstrap();
