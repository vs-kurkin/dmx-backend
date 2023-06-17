import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import DeviceService, { type DeviceList } from '../services/device.js'
import DMXService from '../services/dmx.js'
import { type DeviceInterface } from '../types/Device.js'

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
    description: 'Map {name: device}',
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

  @Post('/:name/universe/:universe/')
  @ApiOperation({ summary: 'Add device' })
  @ApiParam({
    name: 'name',
    description: 'Device name',
  })
  @ApiParam({
    name: 'universe',
    description: 'Universe name',
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
    @Param('name') name: string,
    @Param('universe') universe: string,
    @Body() device: DeviceInterface,
  ): number {
    return this.device.addDevice(name, universe, device)
  }

  @Delete('/:name/')
  @ApiOperation({ summary: 'Delete device' })
  @ApiParam({
    name: 'name',
    description: 'Device name',
  })
  remove(@Param('name') name: string) {
    this.device.deleteDevice(name)

    return { status: 'success' }
  }

  @Get('/:name/channel/:number/')
  @ApiOperation({ summary: 'Get device channel value' })
  @ApiParam({
    name: 'name',
    description: 'Device name',
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
  read(@Param('name') name: string, @Param('number') channel: number): number {
    const universe = this.device.getUniverse(name)
    const address = this.device.getAddress(name, Number(channel))

    return this.dmx.getValue(universe, address)
  }

  @Post('/:name/channel/:number/value/:value')
  @ApiOperation({ summary: 'Set device channel value' })
  @ApiParam({
    name: 'name',
    description: 'Device name',
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
    @Param('name') name: string,
    @Param('number') channel: number,
    @Param('value') value: number,
  ) {
    const universe = this.device.getUniverse(name)
    const address = this.device.getAddress(name, Number(channel))

    this.dmx.setValue(universe, address, Number(value))

    return { status: 'success' }
  }

  @Get('/:name/channels/')
  @ApiOperation({ summary: 'Get all channels value of device' })
  @ApiParam({
    name: 'name',
    description: 'Device name',
  })
  @ApiResponse({
    status: 200,
    type: Array,
    description: 'Device channels value list',
  })
  readAll(@Param('name') name: string): number[] {
    const universe = this.device.getUniverse(name)
    const begin = this.device.getAddress(name)
    const end = this.device.getAddressEnd(name)

    return this.dmx.getValues(universe, begin, end)
  }

  @Post('/:name/channels/:value')
  @ApiOperation({ summary: 'Set all channels value of device' })
  @ApiParam({
    name: 'name',
    description: 'Device name',
  })
  updateAll(
    @Param('name') name: string,
    @Param('value') value: number,
  ) {
    const universe = this.device.getUniverse(name)
    const begin = this.device.getAddress(name)
    const end = this.device.getAddressEnd(name)

    this.dmx.fill(universe, Number(value), begin, end)

    return { status: 'success' }
  }
}
