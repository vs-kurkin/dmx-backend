import webSocketConfig, { getSocketPort } from '#configs/websocket'
import DMXService, { type DMXMapValues } from '#services/dmx'
import type { SerialID } from '@dmx-cloud/dmx-types'
import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'

@WebSocketGateway(getSocketPort(), webSocketConfig())
export default class WebSocketController {
  protected readonly dmxService: DMXService

  constructor(dmx: DMXService) {
    this.dmxService = dmx
  }

  @SubscribeMessage('channel')
  channel(
    @MessageBody('id') id: SerialID,
    @MessageBody('channel') channel: number,
    @MessageBody('value') value: number,
  ) {
    this.dmxService.setValue(id, channel, value)
  }

  @SubscribeMessage('channels')
  channels(
    @MessageBody('id') id: SerialID,
    @MessageBody('values') values: DMXMapValues,
  ) {
    this.dmxService.update(id, values)
  }

  @SubscribeMessage('stop')
  stop(@MessageBody() id: SerialID) {
    this.dmxService.stop(id)
  }
}
