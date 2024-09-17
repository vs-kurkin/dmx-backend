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

  constructor(dmx: DMXService) {
    this.dmxService = dmx
    this.events = new Map
  }

  @Sse('sse')
  @ApiResponse({ status: 200, description: 'SSE stream' })
  sse(): Observable<MessageEvent> {
    return from(this.events).pipe(
      map(([id, type]) => ({
        type,
        data: { [id]: this.read(id) },
      })),
    )
  }

  @OnEvent('add')
  add(id: string) {
    this.events.set(id, 'add')
  }

  @OnEvent('delete')
  delete(id: string) {
    this.events.delete(id)
  }

  @OnEvent('clear')
  clear() {
    this.events.clear()
  }

  @OnEvent('update')
  update(id: string) {
    this.events.set(id, 'update')
  }

  read(id: string) {
    if (this.events.has(id)) {
      this.delete(id)

      return this.dmxService.getValues(id)
    }
  }
}
