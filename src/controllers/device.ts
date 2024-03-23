import DeviceService, { type DeviceInterface, type DeviceList } from '#services/device.ts'
import DMXService from '#services/dmx.ts'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

@Controller('device')
@ApiTags('Device')
export default class DeviceController {
  constructor(
    private readonly dmx: DMXService,
    private readonly device: DeviceService,
  ) {
    this.dmx = dmx
    this.device = device
  }

  @Get('/')
  @ApiOperation({ summary: 'Returns device list' })
  @ApiResponse({
    status: 200,
    description: 'Map {id: device}',
    type: Object,
  })
  getDevices(): DeviceList {
    return this.device.getDevices()
  }

  @Delete('/')
  @ApiOperation({ summary: 'Delete all devices' })
  removeAll() {
    this.device.deleteAllDevices()

    return { status: 'success' }
  }

  @Post('/:id/universe/:universe/')
  @ApiOperation({ summary: 'Add device' })
  @ApiParam({
    name: 'id',
    description: 'Device id',
  })
  @ApiParam({
    name: 'universe',
    description: 'Universe id',
  })
  @ApiBody({
    description: 'Device object',
    type: Object,
  })
  @ApiResponse({
    description: 'DMX address of device',
    status: 201,
    type: Number,
  })
  add(
    @Param('id') id: string,
    @Param('universe') universe: string,
    @Body() device: DeviceInterface,
  ): number {
    return this.device.addDevice(id, universe, device)
  }

  @Delete('/:id/')
  @ApiOperation({ summary: 'Delete device' })
  @ApiParam({
    name: 'id',
    description: 'Device id',
  })
  remove(@Param('id') id: string) {
    this.device.deleteDevice(id)

    return { status: 'success' }
  }

  @Get('/:id/channel/:number/')
  @ApiOperation({ summary: 'Get device channel value' })
  @ApiParam({
    name: 'id',
    description: 'Device id',
  })
  @ApiParam({
    name: 'number',
    description: 'Channel number',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    type: Number,
    description: 'Device channel value',
  })
  read(@Param('id') id: string, @Param('number') channel: number): number {
    const universe = this.device.getUniverse(id)
    const address = this.device.getAddress(id, Number(channel))

    return this.dmx.getValue(universe, address)
  }

  @Patch('/:id/channel/:number/value/:value')
  @ApiOperation({ summary: 'Set device channel value' })
  @ApiParam({
    name: 'id',
    description: 'Device id',
  })
  @ApiParam({
    name: 'number',
    description: 'Channel number',
    type: Number,
  })
  @ApiParam({
    name: 'value',
    description: 'Channel value',
    type: Number,
  })
  update(
    @Param('id') id: string,
    @Param('number') channel: number,
    @Param('value') value: number,
  ) {
    const universe = this.device.getUniverse(id)
    const address = this.device.getAddress(id, Number(channel))

    this.dmx.setValue(universe, address, Number(value))

    return { status: 'success' }
  }

  @Get('/:id/channels/')
  @ApiOperation({ summary: 'Get all channels value of device' })
  @ApiParam({
    name: 'id',
    description: 'Device id',
  })
  @ApiResponse({
    status: 200,
    type: Array,
    description: 'Device channels value list',
  })
  readAll(@Param('id') id: string): number[] {
    const universe = this.device.getUniverse(id)
    const begin = this.device.getAddress(id)
    const end = this.device.getAddressEnd(id)

    return this.dmx.getValues(universe, begin, end)
  }

  @Patch('/:id/channels/:value')
  @ApiOperation({ summary: 'Set all channels value of device' })
  @ApiParam({
    name: 'id',
    description: 'Device id',
  })
  updateAll(@Param('id') id: string, @Param('value') value: number) {
    const universe = this.device.getUniverse(id)
    const begin = this.device.getAddress(id)
    const end = this.device.getAddressEnd(id)

    this.dmx.fill(universe, Number(value), begin, end)

    return { status: 'success' }
  }
}
