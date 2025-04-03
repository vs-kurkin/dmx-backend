import { DeviceModel } from '#schemas/device'
import type { Device, DeviceIndex, DeviceList } from '@dmx-cloud/dmx-types'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { type Document, Model } from 'mongoose'
import Joi from 'joi'

@Injectable()
export default class DeviceService {
  protected readonly model: Model<Device>

  /**
   * Create a new DeviceService instance.
   *
   * @param model The Mongoose model for devices
   */
  constructor(
    @InjectModel(DeviceModel.name) model: Model<Device>,
  ) {
    this.model = model
  }

  /**
   * Get the total DMX channel count for all devices up to but not including the given index.
   *
   * If no index is given, the total DMX channel count for all devices is returned.
   *
   * @param index Optional index to not include in the count
   * @returns total DMX channel count
   */
  async getNextDMX(index?: DeviceIndex) {
    const list = await this.getDeviceList<Device>()

    list.length = index ? Number(index) + 1 : list.length

    return list.reduce((acc, item) => acc + item.channels.length, 0)
  }

  /**
   * Get a device by index.
   *
   * @param index Index of the device
   * @returns The device at the given index
   */
  async getDevice(index: DeviceIndex) {
    const doc = await this.getDeviceByIndex(index)

    return doc.toJSON()
  }

  /**
   * Get all devices.
   *
   * @returns List of all devices
   */
  async getDevices() {
    return await this.getDeviceList()
  }

  /**
   * Replace all devices in the database with the given list of devices.
   *
   * @param devices List of devices to set
   */
  async setDevices(devices: DeviceList) {
    await this.deleteAllDevices()
    await this.model.insertMany(devices)
  }

  /**
   * Add a new device to the database.
   *
   * @param device The device to add
   */
  async addDevice(device: Device) {
    const doc = new this.model(device)

    await doc.save()
  }

  /**
   * Delete a device by index.
   *
   * @param index Index of the device to delete
   */
  async deleteDevice(index: DeviceIndex) {
    const doc = await this.getDeviceByIndex(index)

    await doc.deleteOne()
  }

  /**
   * Delete all devices in the database.
   */
  async deleteAllDevices() {
    await this.model.deleteMany()
  }

  /**
   * Update a device in the database.
   *
   * @param index Index of the device to update
   * @param device The updated device
   */
  async updateDevice(index: DeviceIndex, device: Device) {
    // Validate the device object
    const { error } = this.validateDevice(device)
    if (error) {
      throw new Error(`Invalid device data: ${error.message}`)
    }

    const doc = await this.getDeviceByIndex(index)

    await doc.replaceOne({ $set: device }, { runValidators: true })
    await doc.save()
  }

  /**
   * Get all devices from the database.
   *
   * @returns List of all devices in the database
   * @template T the type of the documents in the returned list, defaulting to `Document<Device>`
   */
  private async getDeviceList<T = Document<Device>>(): Promise<T[]> {
    return await this.model.find<T>().exec()
  }

  /**
   * Get a device by index from the database.
   *
   * @param index Index of the device to get
   * @throws Error If the device with the given index is not found
   * @returns The document of the device at the given index
   */
  private async getDeviceByIndex(index: DeviceIndex): Promise<Document<Device>> {
    const result = await this.getDeviceList()

    if (index in result) {
      return result[index]
    }

    throw new Error(`Device with index "${index}" is not found`)
  }

  /**
   * Validate the device object.
   *
   * @param device The device object to validate
   * @returns The result of the validation
   */
  private validateDevice(device: Device) {
    const schema = Joi.object({
      // Define the schema for the device object
      name: Joi.string().required(),
      channels: Joi.array().items(Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        type: Joi.string().required(),
      })).required(),
      // Add other fields as necessary
    })

    return schema.validate(device)
  }
}
