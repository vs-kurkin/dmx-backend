import { registerAs } from '@nestjs/config'
import { GatewayMetadata } from '@nestjs/websockets';

export default registerAs(
  'webSocket',
  (): GatewayMetadata => ({
    path: '/ws',
    pingInterval: 1000 * 60 * 30,
    transports: ['websocket'],
    cors: {
      origin: process.env.NODE_ENV === 'production' ? false : ['192.168.0.169:8081'],
    },
  }),
)
