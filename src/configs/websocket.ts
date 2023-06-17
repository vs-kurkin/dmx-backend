import { registerAs } from '@nestjs/config'
import { GatewayMetadata } from '@nestjs/websockets'
import * as process from 'process'

export const PORT = Number(process.env.NEST_SOCKET_PORT) || 8081

export default registerAs(
  'webSocket',
  (): GatewayMetadata => ({
    path: '/ws',
    pingInterval: 1000 * 60 * 30,
    transports: ['websocket'],
    cors: {
      origin: process.env.NODE_ENV === 'production' ? false : ['*'],
    },
  }),
)
