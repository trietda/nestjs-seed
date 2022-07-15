import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerModule } from 'nestjs-pino';
import { v4 as uuid } from 'uuid';
import DatabaseModule from './module/database/database.module';
import AppController from './app.controller';
import appConfig from './config/app.config';
import swaggerConfig from './config/swagger.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env.prod', '.env'],
      load: [
        appConfig,
        swaggerConfig,
      ],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        pinoHttp: {
          autoLogging: false,
          quietReqLogger: true,
          genReqId: function genReqId(req) {
            return (
              req.headers['x-request-id'] || req.headers['x-trace-id'] || uuid()
            );
          },
          level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
          transport:
            process.env.NODE_ENV === 'development'
              ? { target: 'pino-pretty' }
              : undefined,
        },
      }),
    }),
    TerminusModule,
    DatabaseModule,
  ],
  controllers: [AppController],
})
export default class AppModule {}
