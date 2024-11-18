import {isDevelopment} from '#configs/env'
import {registerAs} from '@nestjs/config'

export interface ServerConfig {
  readonly http: boolean;
  readonly port: number;
}

export default registerAs(
  'devtools',
  (): ServerConfig => ({
    http: !isDevelopment(),
    port: 8070
  }),
)
