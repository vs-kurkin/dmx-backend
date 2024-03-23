import DevToolsConfig from '#configs/devtools.ts'
import ServerConfig from '#configs/server.ts'
import SwaggerConfig from '#configs/swagger.ts'
import WebSocketConfig from '#configs/websocket.ts'
import DeviceController from '#controllers/device.ts'
import DMXController from '#controllers/dmx.ts'
import SerialController from '#controllers/serial.ts'
import GatewayWebSocket from '#events/websocket.ts'
import { Universe, UniverseSchema } from '#schemas/universe.ts'
import DeviceService from '#services/device.ts'
import DMXService from '#services/dmx.ts'
import SerialService from '#services/serial.ts'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DevtoolsModule } from '@nestjs/devtools-integration'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    DevtoolsModule.register(DevToolsConfig()),
    MongooseModule.forRoot('mongodb://localhost:27017/dmx'),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env.development', '.env.production'],
      load: [ServerConfig, WebSocketConfig, SwaggerConfig],
    }),
    MongooseModule.forFeature([
      { name: Universe.name, schema: UniverseSchema },
    ]),
  ],
  controllers: [SerialController, DMXController, DeviceController],
  providers: [GatewayWebSocket, SerialService, DMXService, DeviceService],
})
export default class App {}
