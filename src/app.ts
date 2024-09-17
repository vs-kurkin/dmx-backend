import DeviceController from '#controllers/device'
import DMXController from '#controllers/dmx'
import SerialController from '#controllers/serial'
import WebSocketController from '#events/client'
import ServerEventsController from '#events/server'
import DeviceService from '#services/device'
import DMXService from '#services/dmx'
import SerialService from '#services/serial'
import { imports } from '#utils/config'
import { Module } from '@nestjs/common'

@Module({
  imports,

  controllers: [
    ServerEventsController,
    SerialController,
    DMXController,
    DeviceController,
  ],

  providers: [
    WebSocketController,
    SerialService,
    DMXService,
    DeviceService,
  ],
})

export default class App {}
