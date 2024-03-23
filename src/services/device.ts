import { Injectable } from '@nestjs/common'

export type ChannelType = '';

export type ChannelInterface = {
  name: string;
  value?: number;
  type?: ChannelType;
  default?: number;
  min?: number;
  max?: number;
  amount?: number;
  steps?: number[];
}

export type DeviceInterface = {
  vendor: string;
  model: string;
  mode: string;
  channels: ChannelInterface[];
}

export type DeviceList = Record<string, DeviceInterface>

@Injectable()
export default class DeviceService {
  private offset = new Map<string, number>()
  private devices = new Map<string, DeviceInterface>()
  private universes = new Map<string, string>()

  addDevice(id: string, universe: string, device: DeviceInterface): number {
    if (this.devices.has(id)) {
      throw new Error(`Device ${id} already exists`)
    }

    const offset = this.offset.get(id) || this.getFreeAddress()

    this.offset.set(id, offset + device.channels.length)
    this.universes.set(id, universe)
    this.devices.set(id, device)

    return offset
  }

  getDevice(id: string): DeviceInterface | void {
    return this.devices.get(id)
  }

  deleteDevice(id: string) {
    if (!this.devices.has(id)) {
      throw new Error(`Device ${id} does not exist`)
    }

    this.offset.delete(id)
    this.devices.delete(id)
    this.universes.delete(id)
  }

  deleteAllDevices() {
    this.offset.clear()
    this.devices.clear()
    this.universes.clear()
  }

  getUniverse(id: string): string {
    return this.universes.get(id) as string
  }

  getDevices(): DeviceList {
    const result = {}

    Array.from(this.devices.keys()).reduce(
      (list: DeviceList, id: string) => {
        list[id] = this.devices.get(id) as DeviceInterface

        return list
      },
      result,
    )

    return result
  }

  getAddress(id: string, channel = 1): number {
    const device = this.getDevice(id)

    if (!device) {
      throw new Error(`Device ${id} not found`)
    }

    const end = this.getAddressEnd(id)

    return end - device.channels.length + channel - 1
  }

  getAddressEnd(id: string) {
    return (this.offset.get(id) || 0) + 1
  }

  private getFreeAddress(): number {
    return [...this.offset.values()].pop() || 0
  }
}
