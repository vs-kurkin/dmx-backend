import { Injectable } from '@nestjs/common';
import { ChannelValue } from '@/types/Channel';

@Injectable()
export class DMXService {
  private channels: number[] = [];

  setValue(address: number, value: ChannelValue) {
    this.channels[address] = value;
  }

  getValue(address: number): number {
    return address in this.channels ? this.channels[address] : 0;
  }
}
