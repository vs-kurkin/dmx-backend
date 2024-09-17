import { isProduction } from '#configs/env'
import { registerAs } from '@nestjs/config'
import type { GatewayMetadata } from '@nestjs/websockets'
import process from 'process'

const PING = 1000 * 60 * 30
const PORT = Number(process.env.NEST_SOCKET_PORT ?? 8081)

export const getSocketPort = () => PORT

export default registerAs(
  'webSocket',
  (): GatewayMetadata => ({
    path: '/ws',
    transports: ['websocket'],
    pingInterval: PING,
    serveClient: false,
    allowEIO3: true,
    cors: {
      origin: isProduction() ? false : ['*'],
    },
  }),
)
