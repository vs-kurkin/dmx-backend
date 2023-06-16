import { Injectable } from '@nestjs/common';
import { DeviceInterface } from '../types/Device.js';

export type DeviceList = Record<number, DeviceInterface>;

@Injectable()
export default class DeviceService {
  private offset = new Map<string, number>();
  private devices = new Map<string, DeviceInterface>();
  private universes = new Map<string, string>();

  private getFreeAddress(): number {
    return [...this.offset.values()].pop() || 0;
  }

  addDevice(name: string, universe: string, device: DeviceInterface): number {
    if (this.devices.has(name)) {
      throw new Error(`Device ${name} already exists`);
    }

    const offset = this.offset.get(name) || this.getFreeAddress();

    this.offset.set(name, offset + device.channels.length);
    this.devices.set(name, device);
    this.universes.set(name, universe);

    return offset;
  }

  getDevice(name: string): DeviceInterface | void {
    return this.devices.get(name);
  }

  deleteDevice(name: string): void {
    if (!this.devices.has(name)) {
      throw new Error(`Device ${name} does not exist`);
    }

    this.offset.delete(name);
    this.devices.delete(name);
    this.universes.delete(name);
  }

  deleteAllDevices(): void {
    this.offset.clear();
    this.devices.clear();
    this.universes.clear();
  }

  getUniverse(name: string): string {
    return this.universes.get(name);
  }

  getDevices(): DeviceList {
    const result = {};

    Array.from(this.devices.keys()).reduce(
      (list: DeviceList, name: string) => {
        list[name] = this.devices.get(name);

        return list;
      },
      result,
    );

    return result;
  }

  getAddress(name: string, channel = 1): number {
    const device = this.getDevice(name);

    if (!device) {
      throw new Error(`Device ${name} not found`);
    }

    const end = this.getAddressEnd(name);

    return end - device.channels.length + channel - 1;
  }

  getAddressEnd(name: string) {
    return (this.offset.get(name) || 0) + 1;
  }
}
