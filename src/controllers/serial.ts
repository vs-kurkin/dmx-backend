import SerialService from '#services/serial.ts'
import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@Controller('serial')
@ApiTags('Serial')
export default class SerialController {
  constructor(private readonly serial: SerialService) {
    this.serial = serial
  }

  @Get('/')
  @ApiOperation({ summary: 'Returns serial ports info' })
  @ApiResponse({
    status: 200,
    type: Array,
    description: 'Port info list',
  })
  getDevices() {
    return this.serial.list()
  }
}
