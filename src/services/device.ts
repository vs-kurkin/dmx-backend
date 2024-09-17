import { DeviceModel } from '#schemas/device'
import type { Device, DeviceIndex, DeviceList } from '@dmx-cloud/dmx-types'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { type Document, Model } from 'mongoose'

@Injectable()
export default class DeviceService {
  protected readonly model: Model<Device>

  constructor(
    @InjectModel(DeviceModel.name) model: Model<Device>,
  ) {
    this.model = model
  }

  async getDeviceDMX(index?: DeviceIndex) {
    const list = await this.getDeviceList()

    list.length = index ? Number(index) + 1 : list.length

    return list.reduce((acc, item) => acc + item.channels.length, 0)
  }

  async getDevice(index: DeviceIndex) {
    const doc: Document<Device> = await this.getDeviceByIndex(index)

    return doc.toJSON()
  }

  async getDevices() {
    return await this.getDeviceList()
  }

  async setDevices(devices: DeviceList) {
    await this.deleteAllDevices()
    await this.model.insertMany(devices)
  }

  async addDevice(device: Device) {
    const doc = new this.model(device)

    await doc.save()
  }

  async deleteDevice(index: DeviceIndex) {
    const doc = await this.getDeviceByIndex(index)

    await doc.deleteOne()
  }

  async deleteAllDevices() {
    await this.model.deleteMany()
  }

  async updateDevice(index: DeviceIndex, device: Device) {
    const doc = await this.getDeviceByIndex(index)

    await doc.replaceOne(device, { runValidators: true })
    await doc.save()
  }

  private async getDeviceList<T = Device>(): Promise<T[]> {
    return await this.model.find<T>()
      .exec()
  }

  private async getDeviceByIndex<T = Document<Device>>(index: DeviceIndex): Promise<T> {
    const result = await this.getDeviceList<T>()

    if (index in result) {
      return result[index]
    }

    throw new Error(`Device with index "${index}" is not found`)
  }
}
