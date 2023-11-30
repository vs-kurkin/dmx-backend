import { registerAs } from '@nestjs/config'
import { isDevelopment } from './env.js'

export interface ServerConfig {
  http: boolean;
}

export default registerAs('devtools', (): ServerConfig => ({
  http: !isDevelopment(),
}))
