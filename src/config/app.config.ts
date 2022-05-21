import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.PORT != null ? parseInt(process.env.PORT, 10) : 3000,
  defaultVersion: '1.1',
}));
