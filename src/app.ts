import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { DeviceController, DMXController } from '@/controllers/index';
import { DMXService, DeviceService } from '@/services/index';

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
export class App {}
