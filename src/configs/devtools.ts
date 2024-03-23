import { isDevelopment } from '#configs/env.ts'
import { registerAs } from '@nestjs/config'

export interface ServerConfig {
  http: boolean;
}

export default registerAs(
  'devtools',
  (): ServerConfig => ({
    http: !isDevelopment(),
  }),
)
