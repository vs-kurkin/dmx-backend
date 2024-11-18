import {registerAs} from '@nestjs/config'
import process from 'process'

export interface ServerConfig {
  readonly host: string;
  readonly path: string;
  readonly port: number;
  readonly schema: string;
}

export type ServerOptions = Readonly<Partial<ServerConfig>>;

export default registerAs('server', (): ServerConfig => ({
  host: process.env.NEST_API_HOST ?? '',
  path: '/api',
  port: Number(process.env.NEST_API_PORT),
  schema: 'http',
}))
