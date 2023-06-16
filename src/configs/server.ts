import { registerAs } from '@nestjs/config';

export interface ServerConfig {
  schema: string;
  host: string;
  port: number;
  path: string;
}

export default registerAs('server',(): ServerConfig => ({
  schema: 'http',
  host: process.env.VITE_API_HOST ?? '0.0.0.0',
  port: Number(process.env.VITE_API_PORT ?? 80),
  path: '/api',
}));
