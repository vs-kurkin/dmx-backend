import { Injectable } from '@nestjs/common'
import DMX, { DRIVERS } from '@vk/dmx'

export { DRIVERS }

export interface OtherDriverOptions {
  host?: string
  port?: string
  baudRate?: number
  dataBits?: number
  stopBits?: number
  universe?: number
  interval?: number
}

export interface UniverseOptions extends OtherDriverOptions {
  name: string
  path: string
  driver: string
}

export type DMXMapValues = Record<number, number>

@Injectable()
export default class DMXService {
  private readonly dmx: DMX

  constructor() {
    this.dmx = new DMX()
  }

  addUniverse(name: string, driver: string, path: string) {
    this.dmx.addUniverse(name, driver, { path })
  }

  deleteUniverse(name: string) {
    return this.dmx.deleteUniverse(name)
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

  getValue(universe: string, address: number): number {
    return this.dmx.getValue(universe, address)
  }

  getValues(universe: string, begin?: number, end?: number): number[] {
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
