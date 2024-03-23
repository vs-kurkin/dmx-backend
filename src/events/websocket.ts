import webSocketConfig, { getSocketPort } from '#configs/websocket.ts'
import DMXService, { type DMXMapValues } from '#services/dmx.ts'
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway(getSocketPort(), webSocketConfig())
export default class GatewayWebSocket {
  @WebSocketServer()
  server: Server | undefined

  constructor(private readonly dmx: DMXService) {
    this.dmx = dmx
  }

  @SubscribeMessage('update')
  channel(
    _: Socket,
    @MessageBody() { id, channel, value }: { id: string; channel: number; value: number },
  ) {
    this.dmx.setValue(id, channel, value)
  }

  @SubscribeMessage('channels')
  channels(
    _: Socket,
    @MessageBody() id: string,
    @MessageBody() values: DMXMapValues,
  ) {
    this.dmx.update(id, values)
  }

  @SubscribeMessage('stop')
  stop(_: Socket, @MessageBody() id: string) {
    this.dmx.stop(id)
  }
}
