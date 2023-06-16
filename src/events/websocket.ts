import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

import webSocketConfig from '../configs/websocket.js'
import DMXService from '../services/dmx.js'

@WebSocketGateway(8081, webSocketConfig())
export default class GatewayWebSocket {
  @WebSocketServer()
  server: Server

  constructor(private readonly dmx: DMXService) {
    this.dmx = dmx
  }

  @SubscribeMessage('channel')
  channel(client: Socket, { name, channel, value }) {
    this.dmx.setValue(name, channel, value)
  }

  @SubscribeMessage('channels')
  channels(client: Socket, { name, values }) {
    this.dmx.update(name, values)
  }

  @SubscribeMessage('stop')
  stop(client: Socket, { name }) {
    this.dmx.stop(name)
  }
}
