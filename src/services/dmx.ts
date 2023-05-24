import { Injectable } from '@nestjs/common';
import { ChannelValue } from '@/types/Channel';
import DMX from '@vk/dmx';

@Injectable()
export default class DMXService {
  private readonly dmx: any;
  private channels: Map<number, number> = new Map();

  constructor() {
    this.dmx = new DMX();
  }

  setValue(address: number, value: ChannelValue) {
    this.channels[address] = value;
  }

  getValue(address: number): number {
    return this.channels.has(address) ? this.channels.get(address) : 0;
  }

  setAll(value) {
    this.channels = new Map([].fill(value, this.channels.size));
  }
}
