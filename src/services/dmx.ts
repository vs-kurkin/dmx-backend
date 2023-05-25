import { Injectable } from '@nestjs/common';
import { ChannelValue } from '@/types/Channel';
import DMX from '@vk/dmx';

@Injectable()
export default class DMXService {
  private readonly dmx: DMX;

  constructor() {
    this.dmx = new DMX();
  }

  addUniverse(name: string, driver: string, options: any) {
    return this.dmx.addUniverse(name, driver, options);
  }

  getValue(name: string, address: number): number {
    return this.dmx.get(name, address);
  }

  update(name: string, values: any) {
    this.dmx.update(name, values);
  }

  updateAll(name: string, value: number) {
    this.dmx.updateAll(name, value);
  }
}
