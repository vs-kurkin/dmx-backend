import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import DMXController from './controllers/dmx.js';
import DeviceController from './controllers/device.js';
import DMXService from './services/dmx.js';
import DeviceService from './services/device.js';

const IS_PROD = process.env.NODE_ENV !== 'development';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DevtoolsModule.register({
      http: IS_PROD,
    }),
  ],
  controllers: [DMXController, DeviceController],
  providers: [DMXService, DeviceService],
})
export default class App {}
