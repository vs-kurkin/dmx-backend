import { Universe } from '#schemas/universe'
import DMXService, { type UniverseModel } from '#services/dmx'
import { DRIVERS } from '@dmx-cloud/dmx'
import type { SerialDrivers, SerialID, SerialOptions, SerialUniverses } from '@dmx-cloud/dmx-types'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { SerialPort } from 'serialport'

@Injectable()
export default class SerialService {
  protected readonly model: UniverseModel
  protected readonly dmxService: DMXService
  private declare current: SerialID | undefined

  constructor(
    dmxService: DMXService,
    @InjectModel(Universe.name) model: Model<typeof Universe>,
  ) {
    this.model = model
    this.dmxService = dmxService
    this.current = undefined
  }

  list() {
    return SerialPort.list()
  }

  getDrivers(): SerialDrivers {
    return [...DRIVERS] as SerialDrivers
  }

  getCurrent(): SerialID | void {
    return this.current
  }

  setCurrent(serial: SerialID) {
    this.current = serial
  }

  getUniverses(): SerialUniverses {
    return this.dmxService.getUniverses()
  }

  async addSerial(options: SerialOptions) {
    this.dmxService.addUniverse(options)

    await this.model.create(options)
  }

  async deleteSerial(id: SerialID) {
    this.dmxService.deleteUniverse(id)

    await this.model.findByIdAndDelete(id).exec()
  }

  async dropSerial() {
    this.dmxService.deleteAllUniverses()

    await this.model.deleteMany().exec()
  }
}
