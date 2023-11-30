import { registerAs } from '@nestjs/config'
import { GatewayMetadata } from '@nestjs/websockets'
import { isProduction, NEST_SOCKET_PORT } from './env.js'

export const PORT = Number(NEST_SOCKET_PORT) || 8081
export const PING = 1000 * 60 * 30

export default registerAs(
  'webSocket',
  (): GatewayMetadata => ({
    path: '/ws',
    pingInterval: PING,
    transports: ['websocket'],
    cors: {
      origin: isProduction() ? false : ['*'],
    },
  }),
)
