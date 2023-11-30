import { registerAs } from '@nestjs/config'
import process from 'process'

export interface ServerConfig {
  schema: string;
  host: string;
  port: number;
  path: string;
}

export default registerAs('server', (): ServerConfig => ({
  schema: 'http',
  host: process.env.NEST_API_HOST,
  port: Number(process.env.NEST_API_PORT),
  path: '/api',
}))
