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

  /**
   * Constructs a new instance of `DMXService`.
   *
   * @param events The event emitter to use for emitting events.
   */
  constructor(
    events: EventEmitter2,
  ) {
    this.dmx = new DMX()

    this.events = events
  }

  /**
   * Adds a new universe to the DMX service.
   *
   * @param {SerialOptions} options The options to add a new universe.
   * @param {string} options.driver The DMX driver to use.
   * @param {string} options.id The ID of the universe to add.
   * @param {string} options.path The path of the DMX device.
   */
  addUniverse({ driver, id, path }: SerialOptions) {
    this.dmx.addUniverse(id, driver, { path })

    this.events.emit('add', id)
  }

  /**
   * Deletes a universe from the DMX service.
   *
   * @param {SerialID} id The ID of the universe to delete.
   */
  deleteUniverse(id: SerialID) {
    this.dmx.deleteUniverse(id)

    this.events.emit('delete', id)
  }

  /**
   * Deletes all universes from the DMX service.
   */
  deleteAllUniverses() {
    this.dmx.deleteAllUniverses()

    this.events.emit('clear')
  }

  /**
   * Gets the list of universes from the DMX service.
   *
   * @returns {SerialUniverses} The list of universes.
   */
  getUniverses(): SerialUniverses {
    return this.dmx.getUniverses()
  }

  /**
   * Gets the value of a DMX channel.
   *
   * @param {string} id The ID of the universe to get the value from.
   * @param {number} address The address of the DMX channel.
   *
   * @returns {number} The value of the DMX channel.
   */
  getValue(id: SerialID, address: number): number {
    return this.dmx.getValue(id, address)
  }

  /**
   * Gets the values of the DMX channels in the given universe.
   *
   * @param {string} id The ID of the universe to get the values from.
   * @param {number} [begin] The starting address of the range of values to
   *     retrieve. If omitted, the values will start from address 0.
   * @param {number} [end] The ending address of the range of values to retrieve.
   *     If omitted, the values will end at the highest address supported by the
   *     universe.
   *
   * @returns {number[]} The values of the DMX channels.
   */
  getValues(id: SerialID, begin?: number, end?: number): number[] {
    return this.dmx.getValues(id, begin, end)
  }

  /**
   * Sets the value of a DMX channel.
   *
   * @param {SerialID} id The ID of the universe to set the value of.
   * @param {number} address The address of the DMX channel to set.
   * @param {number} value The value to set the DMX channel to.
   */
  setValue(id: SerialID, address: number, value: number) {
    this.dmx.setValue(id, address, value)

    this.events.emit('update', id)
  }

  /**
   * Fills a range of DMX channels with the same value.
   *
   * @param {string} id The ID of the universe to fill the values of.
   * @param {number} value The value to fill the DMX channels with.
   * @param {number} [begin] The starting address of the range of values to
   *     fill. If omitted, the values will start from address 0.
   * @param {number} [end] The ending address of the range of values to fill.
   *     If omitted, the values will end at the highest address supported by the
   *     universe.
   */
  fill(id: SerialID, value: number, begin?: number, end?: number) {
    this.dmx.fill(id, value, begin, end)

    this.events.emit('update', id)
  }

  /**
   * Updates the values of a DMX universe.
   *
   * @param {string} id The ID of the universe to update.
   * @param {Object} values An object mapping channel addresses to their new
   *     values.
   */
  update(id: SerialID, values: DMXMapValues) {
    this.dmx.update(id, values)

    this.events.emit('update', id)
  }

  /**
   * Updates all DMX channel values of a universe to the same value.
   *
   * @param {string} id The ID of the universe to update.
   * @param {number} value The value to set all DMX channels to.
   */
  updateAll(id: SerialID, value: number) {
    this.dmx.updateAll(id, value)

    this.events.emit('update', id)
  }

  /**
   * Stop sending data to a DMX universe.
   *
   * @param {string} id The ID of the universe to stop sending to.
   */
  stop(id: SerialID) {
    this.dmx.getUniverse(id).stop()
  }
}
