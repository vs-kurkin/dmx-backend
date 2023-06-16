import { registerAs } from '@nestjs/config';

export interface ServerConfig {
  http: boolean;
}

export default registerAs('devtools', (): ServerConfig => ({
  http: process.env.NODE_ENV !== 'development'
}))
