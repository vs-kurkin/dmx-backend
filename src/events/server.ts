import DMXService from '#services/dmx'
import { Controller, type MessageEvent, Sse } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { from, map, Observable } from 'rxjs'

@Controller()
@ApiTags('SSE')
export default class ServerEventsController {
  protected readonly dmxService: DMXService
  protected events: Map<string, string>

  /**
   * Constructor
   * @param dmx The DMX service to use for retrieving the values of the events.
   */
  constructor(dmx: DMXService) {
    this.dmxService = dmx
    this.events = new Map
  }

  /**
   * SSE endpoint for the server events.
   *
   * This endpoint establishes a Server-Sent Events (SSE) connection, allowing the client to receive real-time updates from the server.
   *
   * @returns An observable of `MessageEvent`s containing the type and data of the event.
   */
  @Sse('sse')
  @ApiResponse({ status: 200, description: 'SSE stream' })
  @ApiOperation({ summary: 'Establish SSE connection for server events' })
  sse(): Observable<MessageEvent> {
    return from(this.events).pipe(
      /**
       * Map each event to a `MessageEvent` object with the type and data.
       * The `data` property is an object with a single key-value pair.
       * The key is the ID of the event, and the value is the data of the event.
       */
      map(([id, type]) => ({
        type,
        data: { [id]: this.read(id) },
      })),
    )
  }

  /**
   * Adds a new event to the events map.
   *
   * This endpoint triggers the addition of a new event to the events map, which will be sent to all connected clients via the SSE connection.
   *
   * @param id The ID of the event to add.
   */
  @OnEvent('add')
  @ApiOperation({ summary: 'Add new event to events map' })
  @ApiParam({ name: 'id', type: String, required: true, description: 'ID of the event to add' })
  add(id: string) {
    this.events.set(id, 'add')
  }

  /**
   * Deletes an event from the events map.
   *
   * This endpoint triggers the deletion of an event from the events map, which will be sent to all connected clients via the SSE connection.
   *
   * @param id The ID of the event to delete.
   */
  @OnEvent('delete')
  @ApiOperation({ summary: 'Delete event from events map' })
  @ApiParam({ name: 'id', type: String, required: true, description: 'ID of the event to delete' })
  delete(id: string) {
    this.events.delete(id)
  }

  /**
   * Clears all events from the events map.
   *
   * This endpoint triggers the clearing of all events from the events map, which will be sent to all connected clients via the SSE connection.
   */
  @OnEvent('clear')
  @ApiOperation({ summary: 'Clear all events from events map' })
  clear() {
    this.events.clear()
  }

  /**
   * Updates an event in the events map.
   *
   * This endpoint triggers the update of an event in the events map, which will be sent to all connected clients via the SSE connection.
   *
   * @param id The ID of the event to update.
   */
  @OnEvent('update')
  @ApiOperation({ summary: 'Update event in events map' })
  @ApiParam({ name: 'id', type: String, required: true, description: 'ID of the event to update' })
  update(id: string) {
    this.events.set(id, 'update')
  }

  /**
   * Read the event from the events map and delete it if it exists.
   *
   * This endpoint reads the event from the events map and deletes it if it exists, returning the data of the event.
   *
   * @param id The ID of the event to read.
   * @returns The data of the event if it exists, otherwise undefined.
   */
  @ApiOperation({ summary: 'Read event from events map and delete if exists' })
  @ApiParam({ name: 'id', type: String, required: true, description: 'ID of the event to read' })
  read(id: string) {
    if (this.events.has(id)) {
      this.delete(id)

      return this.dmxService.getValues(id)
    }
  }
}
