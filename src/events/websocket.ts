import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

import webSocketConfig, { PORT } from '../configs/websocket.js'
import DMXService from '../services/dmx.js'

@WebSocketGateway(PORT, webSocketConfig())
export default class GatewayWebSocket {
  @WebSocketServer()
  server: Server

  constructor(private readonly dmx: DMXService) {
    this.dmx = dmx
  }

  @SubscribeMessage('update')
  channel(_: Socket, { name, channel, value }) {
    this.dmx.setValue(name, channel, value)
  }

  @SubscribeMessage('channels')
  channels(_: Socket, { name, values }) {
    this.dmx.update(name, values)
  }

  @SubscribeMessage('stop')
  stop(_: Socket, { name }) {
    this.dmx.stop(name)
  }
}
