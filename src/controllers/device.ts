import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import DeviceService from '../services/device.js';
import DMXService from '../services/dmx.js';
import { DeviceInterface, DeviceName } from "@/types/Device";
import { ChannelValue } from '@/types/Channel.js';

export type UpdateParams = {
  channel: number;
  name: DeviceName;
  value: ChannelValue;
};

export type HTTPResponse<T> = {
  statusCode?: number;
  errorCode?: number;
  error?: string;
  data?: T;
};

@Controller('device')
export default class DeviceController {
  constructor(
    private readonly dmx: DMXService,
    private readonly device: DeviceService,
  ) {
    this.dmx = dmx;
    this.device = device;
  }

  @Get()
  async getDevices() {
    return this.device.getDevices();
  }

  @Get(':name')
  private getDevice(
    @Param('name') name: DeviceName,
  ): HTTPResponse<DeviceInterface> {
    const device = this.device.getDevice(name);

    return device ? { data: device } : { statusCode: 404 };
  }

  @Post()
  add(@Body() device: DeviceInterface): HTTPResponse<number> {
    const address = this.device.setDevice(device);

    return { data: address };
  }

  @Put(':id/:channel/:value')
  update(@Param() { name, channel, value }: UpdateParams) {
    const address = this.device.getAddress(name, channel);

    this.dmx.setValue(address, value);
  }
}
