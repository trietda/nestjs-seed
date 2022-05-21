import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import CustomTypeOrmLogger from './custom-typeorm-logger';
import databseConfig from 'src/config/databse.config';

@Module({
  imports: [
    ConfigModule.forFeature(databseConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'mysql',
        host: configService.get('database.sql.host'),
        port: +configService.get<number>('database.sql.port'),
        username: configService.get('database.sql.username'),
        password: configService.get('database.sql.password'),
        database: configService.get('database.sql.datbaseName'),
        autoLoadEntities: true,
        logger: configService.get('database.sql.log') && new CustomTypeOrmLogger(),
      }),
    }),
  ],
  exports: [
    TypeOrmModule,
  ]
})
export default class DatabaseModule {}
