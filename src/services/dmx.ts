import { Universe } from '#schemas/universe.ts'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import DMX, { DRIVERS } from '@vk/dmx'
import { Model } from 'mongoose'

export { DRIVERS }

export type UniverseOptions = {
  host?: string;
  port?: string;
  baudRate?: number;
  dataBits?: number;
  stopBits?: number;
  universe?: number;
  interval?: number;
  id: string;
  path: string;
  driver: string;
}

export type DMXMapValues = Record<number, number>

@Injectable()
export default class DMXService {
  private readonly declare dmx: typeof DMX

  constructor(@InjectModel(Universe.name) private readonly model: Model<typeof Universe>) {
    this.dmx = new DMX()
    this.model = model

    // FIXME: Error universe already exists
    // FIXME: Error duplicate key error collection: dmx.universes
    model.db.dropCollection('universes').then(() => {
      console.log('Collection dropped')
    })
  }

  async addUniverse(options: UniverseOptions) {
    this.dmx.addUniverse(options.id, options.driver, { path: options.path })

    await this.model.create(options)
  }

  async deleteUniverse(id: string) {
    this.dmx.deleteUniverse(id)

    await this.model.deleteOne({ id })
  }

  deleteAllUniverses() {
    return this.dmx.deleteAllUniverses()
  }

  getUniverses(): string[] {
    return this.dmx.getUniverses()
  }

  getDrivers(): typeof DRIVERS {
    return DRIVERS.filter((driver: string) => driver !== 'null')
  }

  getValue(universe?: string, address?: number): number {
    return this.dmx.getValue(universe, address)
  }

  getValues(universe?: string, begin?: number, end?: number): number[] {
    return this.dmx.getValues(universe, begin, end)
  }

  setValue(universe: string, address: number, value: number): number {
    return this.dmx.setValue(universe, address, value)
  }

  fill(universe: string, value: number, begin?: number, end?: number) {
    this.dmx.fill(universe, value, begin, end)
  }

  update(universe: string, values: DMXMapValues) {
    this.dmx.update(universe, values)
  }

  updateAll(universe: string, value: number) {
    this.dmx.updateAll(universe, value)
  }

  stop(universe: string) {
    this.dmx.getUniverse(universe).stop()
  }
}
