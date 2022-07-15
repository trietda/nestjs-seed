import * as dotenv from 'dotenv';
import { join } from 'path';
import { cwd } from 'process';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

const options: DataSourceOptions = {
  type: 'mariadb',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE_NAME,
  entities: [join(cwd(), '/src/**/*.entity.ts')],
  migrations: [join(cwd(), '/src/migration/*.ts')],
  migrationsTableName: 'migration',
  synchronize: false,
  dropSchema: false,
};
export default new DataSource(options);
