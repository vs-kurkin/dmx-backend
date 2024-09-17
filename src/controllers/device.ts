import DeviceService from '#services/device'
import type { Device, DeviceList } from '@dmx-cloud/dmx-types'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

@Controller('device')
@ApiTags('Device')
export default class DeviceController {
  protected readonly deviceService: DeviceService

  constructor(device: DeviceService) {
    this.deviceService = device
  }
  @Get('/')
  @ApiOperation({ summary: 'Returns device list' })
  @ApiResponse({
    status: 200,
    description: 'Map {index: device}',
    type: Object,
  })
  getDevices() {
    return this.deviceService.getDevices()
  }

  @Delete('/')
  @ApiOperation({ summary: 'Delete all devices' })
  async removeAll() {
    await this.deviceService.deleteAllDevices()

    return { status: 'success' }
  }

  @Post('/')
  @ApiOperation({ summary: 'Add new device' })
  @ApiBody({
    description: 'Device object',
    type: Object,
  })
  @ApiResponse({
    description: 'DMX address of device',
    status: 201,
    type: Number,
  })
  async add(
    @Body() device: Device,
  ) {
    await this.deviceService.addDevice(device)

    return { status: 'success' }
  }

  @Patch('/')
  @ApiOperation({ summary: 'Set bulk devices' })
  @ApiBody({
    description: 'Device list',
    type: Object,
  })
  @ApiResponse({
    status: 201,
  })
  async set(
    @Body() list: DeviceList,
  ) {
    await this.deviceService.setDevices(list)

    return { status: 'success' }
  }

  @Get('/:index')
  @ApiOperation({ summary: 'Get device' })
  @ApiParam({
    name: 'index',
    description: 'Device index',
  })
  @ApiResponse({
    status: 200,
    description: 'Device object',
    type: Object,
  })
  get(@Param('index') index: number) {
    return this.deviceService.getDevice(index)
  }

  @Patch('/:index')
  @ApiOperation({ summary: 'Update device' })
  @ApiParam({
    name: 'index',
    description: 'Device index',
  })
  @ApiBody({
    description: 'Device object',
    type: Object,
  })
  @ApiResponse({
    status: 200,
    description: 'Device object',
    type: Object,
  })
  async update(
    @Param('index') index: number,
    @Body() device: Device,
  ) {
    await this.deviceService.updateDevice(index, device)

    return { status: 'success' }
  }

  @Delete('/:index/')
  @ApiOperation({ summary: 'Delete device' })
  @ApiParam({
    name: 'index',
    description: 'Device index',
  })
  async remove(@Param('index') index: number) {
    await this.deviceService.deleteDevice(index)

    return { status: 'success' }
  }

  @Get('/dmx/:index/')
  @ApiParam({
    name: 'index',
    description: 'Device index',
  })
  @ApiOperation({ summary: 'Get DMX channel' })
  getDMXChannel(@Param('index') index: number) {
    return this.deviceService.getDeviceDMX(index)
  }

}
