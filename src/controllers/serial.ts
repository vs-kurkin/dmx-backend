import SerialService from '#services/serial'
import type { SerialOptions } from '@dmx-cloud/dmx-types'
import { Controller, Delete, Get, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@Controller('serial')
@ApiTags('Serial')
export default class SerialController {
  private readonly serialService: SerialService

  constructor(serial: SerialService) {
    this.serialService = serial
  }

  @Get('/')
  @ApiOperation({ summary: 'Returns serial ports info' })
  @ApiResponse({
    status: 200,
    type: Array,
    description: 'Port info list',
  })
  getList() {
    return this.serialService.list()
  }

  @Delete('/')
  async dropSerial() {
    await this.serialService.dropSerial()
  }

  @Post('/')
  async addSerial(options: SerialOptions) {
    await this.serialService.addSerial(options)
  }

  @Delete('/:id')
  async deleteSerial(id: string) {
    await this.serialService.deleteSerial(id)
  }

  @Get('/current')
  getCurrent(): string | void {
    return this.serialService.getCurrent()
  }

  @Post('/current')
  setCurrent(serial: string) {
    this.serialService.setCurrent(serial)
  }

  @Get('/drivers')
  @ApiOperation({ summary: 'Returns supported driver list' })
  @ApiResponse({
    status: 200,
    type: Object,
    description: 'Driver list',
  })
  getDrivers() {
    return this.serialService.getDrivers().filter((driver) => driver !== 'null')
  }

}
