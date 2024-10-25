import webSocketConfig, { getSocketPort } from '#configs/websocket'
import DMXService, { type DMXMapValues } from '#services/dmx'
import type { SerialID } from '@dmx-cloud/dmx-types'
import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'

@WebSocketGateway(getSocketPort(), webSocketConfig())
export default class WebSocketController {
  protected readonly dmxService: DMXService

  /**
   * Construct a new WebSocketController
   *
   * @param dmx The DMX service to use for retrieving and setting DMX channel values
   */
  constructor(dmx: DMXService) {
    this.dmxService = dmx
  }

  /**
   * Set a single channel value
   *
   * @param id The Serial ID of the universe
   * @param channel The channel number
   * @param value The value to set the channel to
   */
  @SubscribeMessage('channel')
  channel(
    @MessageBody('id') id: SerialID,
    @MessageBody('channel') channel: number,
    @MessageBody('value') value: number,
  ) {
    this.dmxService.setValue(id, channel, value)
  }

  /**
   * Set multiple channel values
   *
   * @param id The Serial ID of the universe
   * @param values An object with channel numbers as keys and the values to set those channels to
   */
  @SubscribeMessage('channels')
  channels(
    @MessageBody('id') id: SerialID,
    @MessageBody('values') values: DMXMapValues,
  ) {
    this.dmxService.update(id, values)
  }

  /**
   * Stop sending data to a universe
   *
   * @param id The Serial ID of the universe to stop sending to
   */
  @SubscribeMessage('stop')
  stop(@MessageBody() id: SerialID) {
    this.dmxService.stop(id)
  }
}
