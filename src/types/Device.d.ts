import { ChannelInterface } from './Channel.js';

export interface DeviceInterface {
  vendor: string;
  model: string;
  mode: string;
  channels: ChannelInterface[];
}
