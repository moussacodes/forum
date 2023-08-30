import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ImATeapotException, ValidationPipe } from '@nestjs/common';
import { AcessTokenGuard } from './auth/guards';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });
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
   // app.enableCors({
  //   allowedHeaders: 'http://localhost:3000',
  //   origin: 'http://localhost:3000',
  // });

  await app.listen(5000);
}
bootstrap();
