import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  sql: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    datbaseName: process.env.DATABASE_DATABASE_NAME,
    log: false,
  },
}));
