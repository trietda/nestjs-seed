import { RequestMethod, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import CustomValidationPipe from './custom-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new CustomValidationPipe());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: [configService.get('app.defaultVersion')],
  });
  app.setGlobalPrefix('api', {
    exclude: [
      { path: '/files/:filePath', method: RequestMethod.GET },
      { path: '/healthcheck', method: RequestMethod.GET },
    ],
  });
  
  const config = new DocumentBuilder()
    .setTitle(configService.get('swagger.title'))
    .setDescription(configService.get('swagger.description'))
    .setVersion(configService.get('app.defaultVersion'))
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const port = configService.get<number>('app.port');
  app.enableCors();
  await app.listen(port);
}
bootstrap();
