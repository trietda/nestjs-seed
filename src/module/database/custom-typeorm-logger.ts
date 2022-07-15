import { Logger } from '@nestjs/common';
import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';

export default class CustomTypeOrmLogger implements TypeOrmLogger {
  private logger = new Logger(CustomTypeOrmLogger.name);

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.log({
      query,
      parameters,
      msg: 'Execute query',
      isTransactionActive: queryRunner.isTransactionActive,
    });
  }

  logQueryError(error: string | Error, query: string, parameters?: any[]) {
    this.logger.error({
      query,
      parameters,
      err: error,
    });
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.logger.warn({
      query,
      parameters,
      msg: `Execute slow query ${time}`,
    });
  }

  logSchemaBuild(message: string) {
    this.logger.log({
      message,
      msg: 'Schema build',
    });
  }

  logMigration(message: string) {
    this.logger.log({
      message,
      msg: 'Migration',
    });
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    this.logger.log({
      level,
      msg: message,
    });
  }
}
