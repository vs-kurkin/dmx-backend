import { Controller, Get, Param, Post } from '@nestjs/common';
import DMXService from '../services/dmx.js';
import { ChannelValue } from '@/types/Channel.js';

export type SetParams = {
  address: number;
  value: ChannelValue;
};

@Controller('dmx')
export default class DMXController {
  constructor(private readonly dmx: DMXService) {
    this.dmx = dmx;
  }

  @Get(':address')
  async get(@Param('address') address: number) {
    return this.dmx.getValue(address);
  }

  @Post(':address/:value')
  async set(@Param() { address, value }: SetParams) {
    return this.dmx.setValue(address, value);
  }
}
