import { Universe } from '#schemas/universe'
import DMXService, { type UniverseModel } from '#services/dmx'
import { DRIVERS } from '@dmx-cloud/dmx'
import type { SerialDrivers, SerialID, SerialList, SerialOptions, SerialUniverses } from '@dmx-cloud/dmx-types'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { SerialPort } from 'serialport'

@Injectable()
export default class SerialService {
  protected readonly model: UniverseModel
  protected readonly dmxService: DMXService
  private declare current: SerialID | undefined

  /**
   * Create a new `SerialService` instance.
   *
   * @param dmxService The `DMXService` to use
   * @param model The Mongoose model for the `Universe` collection
   */
  constructor(
    dmxService: DMXService,
    @InjectModel(Universe.name) model: Model<typeof Universe>,
  ) {
    this.model = model
    this.dmxService = dmxService
    this.current = undefined
  }

  /**
   * Returns a Promise that resolves with an array of objects representing the
   * available serial ports.
   *
   * @returns {Promise<SerialList>} A Promise that resolves with an
   * array of objects representing the available serial ports
   */
  list(): Promise<SerialList> {
    return SerialPort.list() as unknown as Promise<SerialList>
  }

  /**
   * Returns a Promise that resolves with an array of supported serial drivers.
   *
   * @returns {Promise<SerialDrivers>} A Promise that resolves with an array of
   * supported serial drivers
   */
  getDrivers(): SerialDrivers {
    return [...DRIVERS] as SerialDrivers
  }

  /**
   * Returns the ID of the current serial port, or `undefined` if there is no
   * current serial port.
   *
   * @returns {string | void} The ID of the current serial port, or `undefined`
   */
  getCurrent(): SerialID | void {
    return this.current
  }

  /**
   * Sets the current serial port to the given ID.
   *
   * @param {string} serial The ID of the serial port to set as current
   */
  setCurrent(serial: SerialID) {
    this.current = serial
  }

  /**
   * Gets the list of universes from the DMX service.
   *
   * @returns {SerialUniverses} The list of universes.
   */
  getUniverses(): SerialUniverses {
    return this.dmxService.getUniverses()
  }

  /**
   * Adds a new serial port and associated universe.
   *
   * @param {SerialOptions} options The options to add a new universe.
   */
  async addSerial(options: SerialOptions) {
    this.dmxService.addUniverse(options)

    await this.model.create(options)
  }

  /**
   * Deletes a serial port and associated universe.
   *
   * @param {string} id The ID of the serial port to delete
   */
  async deleteSerial(id: SerialID) {
    this.dmxService.deleteUniverse(id)

    await this.model.findByIdAndDelete(id).exec()
  }

  /**
   * Deletes all serial ports and associated universes.
   */
  async dropSerial() {
    this.dmxService.deleteAllUniverses()

    await this.model.deleteMany().exec()
  }
}
