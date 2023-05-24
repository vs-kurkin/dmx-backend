import { Injectable } from '@nestjs/common';
import { DeviceInterface, DeviceName } from '@/types/Device.js';

@Injectable()
export default class DeviceService {
  private offset = new Map<DeviceName, number>();
  private devices = new Map<DeviceName, DeviceInterface>();

  private getStartAddress(): number {
    return [...this.offset.values()].pop();
  }

  setDevice(device: DeviceInterface): number {
    this.devices.set(device.name, device);

    const offset = this.getStartAddress();

    this.offset.set(device.name, offset + device.channels.length);

    return offset;
  }

  getDevice(name: DeviceName): DeviceInterface | void {
    return this.devices.get(name);
  }

  getDevices(): IterableIterator<DeviceInterface> {
    return this.devices.values();
  }

  getAddress(name: DeviceName, channel: number): number {
    const device = this.getDevice(name);

    if (!device) {
      throw new Error(`Device ${name} not found`);
    }

    const offset = this.offset.get(name);

    return offset - device.channels.length + channel;
  }
}
