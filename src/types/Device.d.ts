import { ChannelInterface } from '@/types/Channel';

export interface DeviceInterface {
  name: string;
  vendor: string;
  model: string;
  driver: string;
  mode: string;
  channels: ChannelInterface[];
}

export type DeviceName = DeviceInterface['name'];
