import { isProduction } from '#configs/env.ts'
import { registerAs } from '@nestjs/config'
import type { GatewayMetadata } from '@nestjs/websockets'
import process from 'process'

export const PING = 1000 * 60 * 30

export const getSocketPort = () => Number(process.env.NEST_SOCKET_PORT) || 8081

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
