import { Universe } from '#schemas/universe'
import DMX from '@dmx-cloud/dmx'
import type { SerialID, SerialOptions, SerialUniverses } from '@dmx-cloud/dmx-types'
import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Model } from 'mongoose'

export type DMXMapValues = Record<number, number>
export type UniverseModel = Model<typeof Universe>

@Injectable()
export default class DMXService {
  protected readonly events: EventEmitter2
  private readonly declare dmx: DMX

  constructor(
    events: EventEmitter2,
  ) {
    this.dmx = new DMX()

    this.events = events
  }

  addUniverse({ driver, id, path }: SerialOptions) {
    this.dmx.addUniverse(id, driver, { path })

    this.events.emit('add', id)
  }

  deleteUniverse(id: SerialID) {
    this.dmx.deleteUniverse(id)

    this.events.emit('delete', id)
  }

  deleteAllUniverses() {
    this.dmx.deleteAllUniverses()

    this.events.emit('clear')
  }

  getUniverses(): SerialUniverses {
    return this.dmx.getUniverses()
  }

  getValue(id: SerialID, address: number): number {
    return this.dmx.getValue(id, address)
  }

  getValues(id: SerialID, begin?: number, end?: number): number[] {
    return this.dmx.getValues(id, begin, end)
  }

  setValue(id: SerialID, address: number, value: number) {
    this.dmx.setValue(id, address, value)

    this.events.emit('update', id)
  }

  fill(id: SerialID, value: number, begin?: number, end?: number) {
    this.dmx.fill(id, value, begin, end)

    this.events.emit('update', id)
  }

  update(id: SerialID, values: DMXMapValues) {
    this.dmx.update(id, values)

    this.events.emit('update', id)
  }

  updateAll(id: SerialID, value: number) {
    this.dmx.updateAll(id, value)

    this.events.emit('update', id)
  }

  stop(id: SerialID) {
    this.dmx.getUniverse(id).stop()
  }
}
