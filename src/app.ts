import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DevtoolsModule } from '@nestjs/devtools-integration'
import DevToolsConfig from './configs/devtools.js'
import ServerConfig from './configs/server.js'
import SwaggerConfig from './configs/swagger.js'
import WebSocketConfig from './configs/websocket.js'
import DeviceController from './controllers/device.js'
import SerialController from './controllers/serial.js'
import DMXController from './controllers/dmx.js'
import GatewayWebSocket from './events/websocket.js'
import DeviceService from './services/device.js'
import DMXService from './services/dmx.js'
import SerialService from './services/serial.js'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env.development', '.env.production'],
      load: [ServerConfig, WebSocketConfig, DevToolsConfig, SwaggerConfig],
    }),
    DevtoolsModule.register(DevToolsConfig()),
  ],
  controllers: [SerialController, DMXController, DeviceController],
  providers: [GatewayWebSocket, SerialService, DMXService, DeviceService],

})
export default class App {}
