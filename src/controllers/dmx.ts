import { Controller, Get, Param, Post } from '@nestjs/common';
import DMXService from '../services/dmx.js';
import { ChannelValue } from '@/types/Channel';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('dmx')
@ApiTags('DMX')
export default class DMXController {
  constructor(private readonly dmx: DMXService) {
    this.dmx = dmx;
  }

  @Get('/:address')
  @ApiOkResponse({
    description: 'DMX channel value',
  })
  async get(@Param('address') address: number) {
    return this.dmx.getValue(address);
  }

  @Post('/:address/:value')
  async set(
    @Param('address') address: number,
    @Param('value') value: ChannelValue,
  ) {
    return this.dmx.setValue(address, value);
  }
}
